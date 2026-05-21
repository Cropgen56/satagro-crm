import { FlaskConical } from 'lucide-react'

export default function TaskProfileHeader({ task }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-primary">
            <FlaskConical className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Task #{task.displayId}
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              {task.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
            <h1 className="mt-2 text-xl font-bold text-gray-900 lg:text-2xl">{task.fullTitle}</h1>
            <p className="mt-1 text-sm text-gray-500">{task.dueLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
          <img
            src={task.assignee.avatar}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Assigned User
            </p>
            <p className="font-semibold text-gray-900">{task.assignee.name}</p>
            <p className="text-xs text-gray-500">{task.assignee.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
