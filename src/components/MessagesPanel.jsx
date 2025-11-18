import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function MessagesPanel({ open, onClose, vendorToStart, onVendorHandled }) {
  const [threads, setThreads] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const token = useMemo(()=> localStorage.getItem('token') || '', [open])

  const authHeaders = useMemo(()=> token ? { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' } : { 'Content-Type':'application/json' }, [token])

  const loadThreads = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/threads`, { headers: authHeaders })
      if (!res.ok) throw new Error('Failed to load threads')
      const data = await res.json()
      setThreads(data)
      if (!active && data.length) setActive(data[0])
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (threadId) => {
    if (!token || !threadId) return
    try {
      const res = await fetch(`${API}/messages/${threadId}`, { headers: authHeaders })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setMessages(data)
    } catch (e) {}
  }

  useEffect(()=>{ if (open) loadThreads() }, [open])
  useEffect(()=>{ if (active?.id) loadMessages(active.id) }, [active?.id])

  // Start thread with vendor if requested
  useEffect(()=>{
    const startWithVendor = async () => {
      if (!open || !vendorToStart) return
      if (!token) { alert('Please login as a student to message vendors.'); return }
      try {
        const res = await fetch(`${API}/threads?vendor_id=${vendorToStart}`, { method:'POST', headers: authHeaders })
        if (!res.ok) {
          const txt = await res.text()
          throw new Error(txt || 'Unable to start thread')
        }
        const t = await res.json()
        await loadThreads()
        // Set active to the created/returned thread
        setActive(prev => ({ id: t.id }))
        await loadMessages(t.id)
      } catch (e) {
        alert('Could not start chat. Make sure you are logged in as a student.')
      } finally {
        // notify parent to clear vendor
        onVendorHandled && onVendorHandled()
      }
    }
    startWithVendor()
  }, [vendorToStart, open])

  const send = async () => {
    if (!text.trim() || !active?.id) return
    setSending(true)
    try {
      const res = await fetch(`${API}/messages`, {
        method:'POST',
        headers: authHeaders,
        body: JSON.stringify({ thread_id: active.id, body: text.trim() })
      })
      if (!res.ok) throw new Error('Failed')
      setText('')
      await loadMessages(active.id)
      await loadThreads()
    } catch (e) {
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      {/* Panel */}
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[720px] bg-white shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold">Messages</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 h-[calc(100%-56px)]">
          {/* Threads */}
          <div className="border-r overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-slate-500">Loading threads…</div>
            ) : threads.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No conversations yet</div>
            ) : (
              threads.map(t => (
                <button key={t.id} onClick={()=> setActive(t)} className={`w-full text-left px-4 py-3 border-b hover:bg-slate-50 ${active?.id===t.id ? 'bg-slate-50' : ''}`}>
                  <div className="text-sm font-semibold">Thread</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{t.last_message || 'New chat'}</div>
                </button>
              ))
            )}
          </div>

          {/* Messages */}
          <div className="col-span-2 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`max-w-[75%] ${m.from_user_id && token && ' '} ${''}`}>
                  <div className={`px-3 py-2 rounded-xl shadow text-sm ${m.from_user_id === parseJwt(token)?.sub ? 'bg-slate-900 text-white ml-auto' : 'bg-slate-100 text-slate-800'}`}>{m.body}</div>
                </div>
              ))}
              {!messages.length && (
                <div className="text-sm text-slate-500">Select a thread or start a new chat with a vendor.</div>
              )}
            </div>
            <div className="border-t p-3 flex gap-2">
              <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send() }} placeholder="Type a message" className="flex-1 px-3 py-2 border rounded-lg" />
              <button onClick={send} disabled={sending || !text.trim()} className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseJwt (token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch { return null }
}
