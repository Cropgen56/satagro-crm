import { Bug, Cloud, Droplets, FlaskConical, Send } from 'lucide-react'

const stats = [
  { label: 'Total Advisories', value: '142' },
  { label: 'Weather Alerts', value: '12' },
  { label: 'Pest Warnings', value: '08' },
  { label: 'Pending Recommendations', value: '05' },
]

const advisories = [
  { icon: Cloud, title: 'Weather Alert', desc: 'Heavy rainfall expected in your region within 24 hours.', status: 'DELIVERED', statusClass: 'bg-green-50 text-green-700', crop: 'Wheat', date: 'Oct 22, 2024' },
  { icon: Droplets, title: 'Irrigation Recommendation', desc: 'Increase irrigation frequency for Plot B due to low soil moisture.', status: 'DELIVERED', statusClass: 'bg-green-50 text-green-700', crop: 'Maize', date: 'Oct 20, 2024' },
  { icon: Bug, title: 'Pest Warning', desc: 'Fall Armyworm activity detected nearby. Inspect crops immediately.', status: 'SCHEDULED', statusClass: 'bg-blue-50 text-blue-700', crop: 'Cotton', date: 'Oct 25, 2024' },
  { icon: FlaskConical, title: 'Fertilizer Advisory', desc: 'Apply NPK 19:19:19 at 50kg/acre during flowering stage.', status: 'DELIVERED', statusClass: 'bg-green-50 text-green-700', crop: 'Maize', date: 'Oct 18, 2024' },
]

export default function AdvisoriesTab() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">Recent Advisories</h3>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                View History
              </button>
              <button type="button" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                Broadcast Alert
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-950">
                <Send className="h-4 w-4" />
                Send Advisory
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {advisories.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                    <item.icon className="h-5 w-5 text-brand-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-6 text-xs text-gray-500">
                      <span>Crop: {item.crop}</span>
                      <span>Sent: {item.date}</span>
                      <button type="button" className="font-semibold text-brand-primary hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900">Regional Risk Overview</h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">High Risk Alerts</span>
                <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">02 Active</span>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Rain Prediction</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div className="h-full w-[60%] rounded-full bg-blue-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Pest Risk</span>
                  <span className="font-bold text-amber-600">ELEVATED</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div className="h-full w-[75%] rounded-full bg-amber-500" />
                </div>
              </div>
            </div>
            <button type="button" className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Full Environmental Report
            </button>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900">Advisory Performance</h4>
            <div className="mt-4 grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-brand-primary">94%</p>
                <p className="text-xs text-gray-500">Delivery Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-primary">88%</p>
                <p className="text-xs text-gray-500">Open Rate</p>
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-gray-500">Recent Interaction (7 Days)</p>
            <div className="mt-2 flex h-16 items-end gap-1">
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-brand-primary/80" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-brand-primary p-5 text-white">
            <p className="text-sm font-semibold">Improve Plot B Yield</p>
            <p className="mt-1 text-xs text-white/80">Run a predictive analysis for better outcomes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
