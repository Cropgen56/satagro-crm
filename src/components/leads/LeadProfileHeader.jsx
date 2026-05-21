import { FileText, Phone } from 'lucide-react'

export default function LeadProfileHeader({ lead }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <img
            src={lead.avatar}
            alt={lead.name}
            className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-gray-50"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">{lead.name}</h1>
              {lead.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                ID: {lead.displayId}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {lead.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-[200px] rounded-xl border border-gray-100 bg-gray-50/80 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Assigned Agent</p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${lead.agent.color}`}
            >
              {lead.agent.initials}
            </span>
            <p className="font-semibold text-gray-900">{lead.agent.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
