import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import SearchFilters from './components/SearchFilters'
import ListingCard from './components/ListingCard'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchList = async (params = {}) => {
    setLoading(true)
    const url = new URL(`${API}/apartments`)
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') url.searchParams.set(k, v) })
    const res = await fetch(url)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { fetchList() }, [])

  const save = async (item) => {
    const token = localStorage.getItem('token')
    if (!token) { alert('Login required to save.'); return }
    await fetch(`${API}/favorites/${item.id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }})
    alert('Saved!')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero />
      <SearchFilters onSearch={fetchList} />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured near you</h2>
          <a href="#login" onClick={(e)=>{e.preventDefault(); const email=prompt('Email'); const pass=prompt('Password'); if(email && pass){ fetch(`${API}/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password: pass})}).then(r=> r.ok ? r.json() : Promise.reject('Invalid')).then(d=>{ localStorage.setItem('token', d.access_token); alert('Logged in')}).catch(()=>alert('Invalid')) } }} className="text-slate-600">Login</a>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <ListingCard key={item.id} item={item} onSave={save} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
