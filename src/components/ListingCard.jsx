import { Star, MapPin } from 'lucide-react'

export default function ListingCard({ item, onSave }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
      <div className="aspect-video bg-slate-200 overflow-hidden">
        {item.photos?.length ? (
          <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">No photo</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <div className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /> {item.rating_avg?.toFixed?.(1) || '0.0'}</div>
        </div>
        <div className="text-slate-600 text-sm mt-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> {item.location} • {item.distance_km} km to campus</div>
        <div className="mt-3 font-bold">₦{new Intl.NumberFormat('en-NG').format(item.price_monthly)} / month</div>
        <div className="mt-3 flex gap-2">
          <a href={`/#/apartment/${item.id}`} className="px-3 py-2 border rounded-lg">View</a>
          <button onClick={() => onSave?.(item)} className="px-3 py-2 bg-slate-900 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  )
}
