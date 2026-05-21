import { MoreVertical, Sprout, UserPlus, CreditCard, CloudRain } from 'lucide-react'
import clsx from 'clsx'

const activities = [
  {
    action: 'New Farmer Added',
    subject: 'Harpreet Singh (ID: #8821)',
    time: '2 mins ago',
    source: 'Agent: Arjun S.',
    icon: UserPlus,
    color: 'bg-green-50 text-green-600',
  },
  {
    action: 'Subscription Renewed',
    subject: 'Gurpreet Kaur — Premium Plan',
    time: '15 mins ago',
    source: 'System',
    icon: CreditCard,
    color: 'bg-teal-50 text-teal-600',
  },
  {
    action: 'Advisory Sent',
    subject: 'Wheat rust prevention — 24 farmers',
    time: '1 hour ago',
    source: 'Agent: Priya P.',
    icon: Sprout,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    action: 'Risk Alert Triggered',
    subject: 'Flood risk — Ludhiana district',
    time: '2 hours ago',
    source: 'CropGen Analytics',
    icon: CloudRain,
    color: 'bg-purple-50 text-purple-600',
  },
]

export default function RecentActivityFeed() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">Recent Activity</h3>
        <button
          type="button"
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <ul className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <li key={activity.action + activity.time} className="flex gap-3">
              <div
                className={clsx(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  activity.color,
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-gray-900">
                  <span className="font-semibold">{activity.action}:</span>{' '}
                  <span className="font-medium">{activity.subject}</span>
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {activity.time} • {activity.source}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
