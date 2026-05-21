import { Tractor } from 'lucide-react'

export default function ActivityProfileHeader({ activity }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-light">
            <Tractor className="h-7 w-7 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
              {activity.type} Visit #{activity.displayId}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {activity.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
          <img
            src={activity.officer.avatar}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Assigned Officer
            </p>
            <p className="font-semibold text-gray-900">{activity.officer.name}</p>
            <p className="text-xs text-gray-500">{activity.officer.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
