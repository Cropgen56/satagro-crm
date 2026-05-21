import { Clock, Lightbulb } from 'lucide-react'

export default function CreateTaskSidebar({ farmer }) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <img src={farmer.headerImage} alt="" className="h-24 w-full object-cover" />
        <div className="relative px-6 pb-6 pt-12">
          <img
            src={farmer.avatar}
            alt={farmer.name}
            className="absolute -top-10 left-6 h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
          />
          <h3 className="mt-2 text-lg font-bold text-gray-900">{farmer.name}</h3>
          <p className="text-xs text-gray-500">
            Farmer ID: {farmer.id} · {farmer.village}
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-900">{farmer.lastActivity}</p>
                <p className="text-xs text-gray-500">{farmer.lastActivityTime}</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">Pending Tasks</span>
              <span className="rounded bg-brand-primary px-2 py-0.5 text-xs font-bold text-white">
                {farmer.pendingTasks} Active · URGENT
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">Subscription Status</span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {farmer.subscription} · {farmer.subscriptionExp}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-5">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Operational Tip</h4>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Schedule farm inspections in the morning (8–11 AM) for better soil sample fidelity and
              farmer availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
