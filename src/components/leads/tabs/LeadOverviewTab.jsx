import { AlertCircle, Calendar, Clock, Info, MapPin, Phone, Smile, User } from 'lucide-react'

const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

export default function LeadOverviewTab({ lead }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Info className="h-4 w-4 text-brand-primary" />
            Lead Information
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Full Name" value={lead.name} />
            <Field label="Contact Number" value={lead.phone} />
            <Field label="Location" value={lead.location} />
            <Field label="Source" value="Referral (External)" />
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Calendar className="h-4 w-4 text-brand-primary" />
            Follow-up Details
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Next Follow-up
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{lead.nextFollowUp}</p>
                <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  DUE SOON
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Priority</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-red-600">
                <AlertCircle className="h-4 w-4" />
                {lead.priority}
              </p>
            </div>
            <Field label="Last Contacted" value={lead.lastContacted} />
            <Field label="Preferred Time" value={lead.preferredTime} />
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <User className="h-4 w-4 text-brand-primary" />
            Assignment & History
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-semibold uppercase text-gray-400">Assigned Agent</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${lead.agent.color}`}
                >
                  {lead.agent.initials}
                </span>
                <span className="text-sm font-medium text-gray-900">{lead.agent.name}</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <Field label="Created By" value={lead.createdBy} />
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <Field label="Created Date" value={lead.createdDate} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-gray-900">Lead Insights</h3>
          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Lead Health</span>
                <span className="flex items-center gap-1 font-medium text-green-600">
                  Good <Smile className="h-4 w-4" />
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${lead.leadHealth}%` }} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Days Inactive</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{String(lead.daysInactive).padStart(2, '0')}</p>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Conversion Probability</span>
                <span className="font-semibold text-green-600">{lead.conversionProbability}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${lead.conversionProbability}%` }}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              Based on engagement patterns and regional conversion trends for similar leads.
            </p>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Recent Activity</h3>
            <button type="button" className="text-xs font-semibold text-brand-primary hover:underline">
              View All
            </button>
          </div>
          <ul className="mt-4 space-y-4">
            {lead.activities.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    item.type === 'call' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {item.type === 'call' ? <Phone className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.user || item.detail} · {item.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <img src={lead.mapImage} alt="Map" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="text-sm font-medium text-white">Nashik Area</span>
            <span className="rounded bg-white/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
              Zone A-4
            </span>
          </div>
          <MapPin className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-brand-primary drop-shadow" />
        </div>
      </div>
    </div>
  )
}
