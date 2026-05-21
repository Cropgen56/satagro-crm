import { Calendar, CheckCircle, Clock, FileText, MapPin, Phone, Tractor } from 'lucide-react'

const summary = [
  { label: 'Total Activities', value: '42', icon: FileText },
  { label: 'Completed Visits', value: '28', icon: CheckCircle },
  { label: 'Pending Follow-ups', value: '05', icon: Clock },
  { label: 'Upcoming', value: '03', icon: Calendar },
]

const activities = [
  {
    icon: Tractor,
    iconBg: 'bg-green-100 text-green-700',
    title: 'Farm Visit - Soil Inspection',
    status: 'COMPLETED',
    statusClass: 'bg-green-50 text-green-700',
    note: 'Moisture levels optimal. Recommended urea intake for Plot A.',
    date: 'Oct 24, 2024',
    link: 'View Full Report',
  },
  {
    icon: Phone,
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'Follow-up Call - Plan Renewal',
    status: 'PENDING',
    statusClass: 'bg-amber-50 text-amber-700',
    note: 'Today, 2:00 PM',
    action: 'Initiate Call',
  },
  {
    icon: MapPin,
    iconBg: 'bg-blue-100 text-blue-700',
    title: 'Advisory Meeting - Pest Management',
    status: 'SCHEDULED',
    statusClass: 'bg-blue-50 text-blue-700',
    date: 'Oct 28, 2024',
  },
]

export default function ActivitiesTab({ farmer }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <s.icon className="h-5 w-5 text-brand-primary" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Activities</h3>
            <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600">
              <option>Filter: All Activities</option>
            </select>
          </div>
          <div className="space-y-4 border-l-2 border-gray-100 pl-6">
            {activities.map((activity) => (
              <div key={activity.title} className="relative rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <span
                  className={`absolute -left-[31px] flex h-10 w-10 items-center justify-center rounded-full ${activity.iconBg}`}
                >
                  <activity.icon className="h-5 w-5" />
                </span>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${activity.statusClass}`}>
                    {activity.status}
                  </span>
                </div>
                {activity.note && <p className="mt-2 text-sm text-gray-600">{activity.note}</p>}
                {activity.date && <p className="mt-2 text-xs text-gray-500">{activity.date}</p>}
                {activity.link && (
                  <button type="button" className="mt-2 text-sm font-semibold text-brand-primary hover:underline">
                    {activity.link}
                  </button>
                )}
                {activity.action && (
                  <button type="button" className="mt-3 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950">
                    {activity.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900">Upcoming Highlights</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <p className="font-medium text-gray-900">Next Field Visit</p>
                <p className="text-gray-500">Oct 28, 2024 — Pest Risk Assessment</p>
              </li>
              <li>
                <p className="font-medium text-gray-900">Reminder</p>
                <p className="text-amber-600">Payment Follow-up — Due in 2 days</p>
              </li>
            </ul>
            <button type="button" className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Calendar
            </button>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Agent Details</h4>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <img src={farmer.agent.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-medium text-gray-900">{farmer.agent.name}</p>
                <p className="text-xs text-gray-500">Lead Field Agent</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">Visit Completion Rate</p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[94%] rounded-full bg-brand-primary" />
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-600">
              <span>Last Interaction: Today</span>
              <span>Success Score: 4.8/5</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <img src={farmer.fieldImage} alt="Field" className="h-40 w-full object-cover" />
            <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">
              PRIMARY FIELD - AREA 2A
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
