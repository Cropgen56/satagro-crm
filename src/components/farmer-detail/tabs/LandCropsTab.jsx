import { AlertTriangle, CloudRain, Droplets, ExternalLink, Map, Sparkles } from 'lucide-react'

function StatCard({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">
        {value}
        {unit && <span className="text-sm font-normal text-gray-500"> {unit}</span>}
      </p>
    </div>
  )
}

const insights = [
  { icon: CloudRain, color: 'text-red-500', bg: 'bg-red-50', title: 'Weather Alert', text: 'High rainfall expected within 48h' },
  { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Irrigation Warning', text: 'Soil moisture low in Plot B' },
  { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Pest Risk', text: 'High risk of Fall Armyworm' },
  { icon: Sparkles, color: 'text-green-600', bg: 'bg-green-50', title: 'Next Activity', text: 'Fertilizer application (Plot A)' },
]

const fields = [
  { plot: 'Plot A', crop: 'Maize', status: 'HEALTHY', statusClass: 'bg-green-50 text-green-700', area: '8.2 Ac', stage: 'Growth', irrigation: 'Drip' },
  { plot: 'Plot B', crop: 'Wheat', status: 'NEEDS WATER', statusClass: 'bg-amber-50 text-amber-700', area: '10.0 Ac', stage: 'Sowing', irrigation: 'Manual' },
]

export default function LandCropsTab({ farmer }) {
  const stats = [
    { label: 'Total Land Area', value: farmer.stats.totalLand, unit: 'Acres' },
    { label: 'Active Fields', value: farmer.stats.activeFields },
    { label: 'Irrigated Area', value: farmer.stats.irrigated, unit: 'Acres' },
    { label: 'Active Crops', value: farmer.stats.activeCrops },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} unit={s.unit} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Map className="h-4 w-4 text-brand-primary" />
              Mapped Fields
            </h3>
            <button type="button" className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline">
              OPEN FULL MAP
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="relative mt-4 overflow-hidden rounded-lg">
            <img src={farmer.mapImage} alt="Field map" className="h-64 w-full object-cover lg:h-80" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-800">
                Click to interact with polygons
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Sparkles className="h-4 w-4 text-brand-primary" />
            Agricultural Insights
          </h3>
          <ul className="mt-4 space-y-3">
            {insights.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-lg border border-gray-50 p-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Individual Fields</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.plot} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{field.plot}</h4>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${field.statusClass}`}>
                  {field.status}
                </span>
              </div>
              <p className="mt-1 text-lg font-bold text-brand-primary">{field.crop}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <dt className="text-gray-500">Area</dt>
                  <dd className="font-medium text-gray-900">{field.area}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Stage</dt>
                  <dd className="font-medium text-gray-900">{field.stage}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Irrigation</dt>
                  <dd className="font-medium text-gray-900">{field.irrigation}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
