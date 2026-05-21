import { Map } from 'lucide-react'

export default function DistrictMapWidget() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
        alt="District map"
        className="h-48 w-full object-cover lg:h-56"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Map className="h-5 w-5" />
              District Operational Map
            </h3>
            <p className="mt-1 text-sm text-white/80">
              Visualize task distribution and field coverage across Maharashtra districts.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-gray-50"
          >
            View Full Map
          </button>
        </div>
      </div>
    </div>
  )
}
