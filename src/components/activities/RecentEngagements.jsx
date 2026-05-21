import { AlertTriangle, CheckCircle, Phone } from 'lucide-react'
import { recentEngagements } from '@/data/activities'

const icons = {
  check: CheckCircle,
  phone: Phone,
  alert: AlertTriangle,
}

export default function RecentEngagements() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Field Engagements</h3>
        <button type="button" className="text-sm font-semibold text-brand-primary hover:underline">
          View All Engagement
        </button>
      </div>
      <ul className="mt-6 space-y-5">
        {recentEngagements.map((item) => {
          const Icon = icons[item.icon] || CheckCircle
          return (
            <li key={item.title} className="flex gap-4">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {item.time} · {item.meta}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
