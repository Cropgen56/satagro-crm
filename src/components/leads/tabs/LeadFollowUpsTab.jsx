import { Calendar, CheckCircle, Clock } from 'lucide-react'

const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

export default function LeadFollowUpsTab({ lead }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Scheduled Follow-ups</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950"
        >
          <Calendar className="h-4 w-4" />
          Schedule Follow-up
        </button>
      </div>

      <div className="space-y-4">
        {lead.followUps.map((item) => (
          <div key={item.date + item.type} className={cardClass}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{item.type}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.date} · {item.agent}</p>
                </div>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                  item.status === 'completed'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
