import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import SearchFilters from './components/SearchFilters'
import ListingCard from './components/ListingCard'
import MessagesPanel from './components/MessagesPanel'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)
  const [vendorToStart, setVendorToStart] = useState(null)

  const fetchList = async (params = {}) => {
    setLoading(true)
    const url = new URL(`${API}/apartments`)
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') url.searchParams.set(k, v) })
    const res = await fetch(url)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  const ensureSeed = async () => {
    try {
      await fetch(`${API}/dev/seed`, { method: 'POST' })
    } catch {}
  }

  useEffect(() => { ensureSeed().then(()=> fetchList()) }, [])

  const save = async (item) => {
    const token = localStorage.getItem('token')
    if (!token) { alert('Login required to save.'); return }
    await fetch(`${API}/favorites/${item.id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }})
    alert('Saved!')
  }

  const login = async () => {
    const email = prompt('Email (tip: student@igloo.dev)')
    const pass = prompt('Password (tip: student123)')
    if(email && pass){
      try {
        const r = await fetch(`${API}/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password: pass})})
        if(!r.ok) throw new Error('Invalid')
        const d = await r.json()
        localStorage.setItem('token', d.access_token)
        alert('Logged in')
      } catch { alert('Invalid') }
    }
  }

  const messageVendor = (vendorId) => {
    setVendorToStart(vendorId)
    setMessagesOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero />
      <SearchFilters onSearch={fetchList} />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured near you</h2>
          <div className="flex items-center gap-4">
            <a href="#messages" onClick={(e)=>{ e.preventDefault(); setMessagesOpen(true) }} className="text-slate-600">Messages</a>
            <a href="#login" onClick={(e)=>{e.preventDefault(); login()}} className="text-slate-600">Login</a>
          </div>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <ListingCard key={item.id} item={item} onSave={save} onMessage={messageVendor} />
            ))}
          </div>
        )}
      </section>

      <MessagesPanel 
        open={messagesOpen} 
        onClose={()=> setMessagesOpen(false)} 
        vendorToStart={vendorToStart}
        onVendorHandled={()=> setVendorToStart(null)}
      />
    </div>
  )
}
