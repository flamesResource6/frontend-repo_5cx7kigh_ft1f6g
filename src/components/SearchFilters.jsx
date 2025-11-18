import { useEffect, useState } from 'react';

export default function SearchFilters({ onSearch }) {
  const [q, setQ] = useState('');
  const [school, setSchool] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [amenities, setAmenities] = useState('');

  return (
    <div id="search" className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
      <div className="bg-white rounded-2xl shadow-xl p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search area or title" className="col-span-2 md:col-span-2 px-3 py-2 border rounded-lg" />
        <input value={school} onChange={e=>setSchool(e.target.value)} placeholder="School (e.g. UNILAG)" className="px-3 py-2 border rounded-lg" />
        <input value={min} onChange={e=>setMin(e.target.value)} placeholder="Min ₦" className="px-3 py-2 border rounded-lg" />
        <input value={max} onChange={e=>setMax(e.target.value)} placeholder="Max ₦" className="px-3 py-2 border rounded-lg" />
        <input value={amenities} onChange={e=>setAmenities(e.target.value)} placeholder="Amenities (wifi, water)" className="col-span-2 md:col-span-2 px-3 py-2 border rounded-lg" />
        <button onClick={() => onSearch({ q, school, min_price: min || undefined, max_price: max || undefined, amenities })} className="md:col-span-1 col-span-2 bg-slate-900 text-white rounded-lg px-4 py-2 font-semibold">Search</button>
      </div>
    </div>
  );
}
