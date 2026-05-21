import { Clock, Phone } from 'lucide-react'

export default function LeadActivityTab({ lead }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
      <div className="mt-8 space-y-6 border-l-2 border-gray-100 pl-6">
        {lead.activities.map((item, i) => (
          <div key={i} className="relative">
            <span
              className={`absolute -left-[31px] flex h-10 w-10 items-center justify-center rounded-full ${
                item.type === 'call' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {item.type === 'call' ? <Phone className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </span>
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="mt-1 text-sm text-gray-500">
              {item.user && `by ${item.user} · `}
              {item.detail}
              {item.time && ` · ${item.time}`}
            </p>
          </div>
        ))}
        <div className="relative">
          <span className="absolute -left-[31px] flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <Clock className="h-5 w-5" />
          </span>
          <p className="font-semibold text-gray-900">Lead Created</p>
          <p className="mt-1 text-sm text-gray-500">{lead.createdDate} · {lead.createdBy}</p>
        </div>
      </div>
    </div>
  )
}
