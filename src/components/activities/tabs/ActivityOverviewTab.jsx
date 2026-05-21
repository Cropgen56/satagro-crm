import { useNavigate } from 'react-router-dom'
import { Calendar, Info, User } from 'lucide-react'

const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

export default function ActivityOverviewTab({ activity }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Info className="h-4 w-4 text-brand-primary" />
            Activity Information
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Type" value={activity.info.type} />
            <Field label="Date" value={activity.info.date} />
            <Field label="Time" value={activity.info.time} />
            <Field label="Duration" value={activity.info.duration} />
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <User className="h-4 w-4 text-brand-primary" />
            Linked Farmer
          </h3>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${activity.linkedFarmer.color}`}
              >
                {activity.linkedFarmer.initials}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{activity.linkedFarmer.name}</p>
                <p className="text-sm text-gray-500">ID: {activity.linkedFarmer.id}</p>
                <p className="text-sm text-gray-500">Village: {activity.linkedFarmer.village}</p>
              </div>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
              {activity.linkedFarmer.tier}
            </span>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-gray-900">Activity Notes</h3>
          <div className="mt-4 rounded-xl bg-green-50/80 p-4">
            <p className="text-xs font-semibold uppercase text-brand-primary">Instructions</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{activity.instructions}</p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-gray-400">Field Remarks</p>
            <p className="mt-2 text-sm italic text-gray-500">{activity.fieldRemarks}</p>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Calendar className="h-4 w-4 text-brand-primary" />
            Follow-up Information
          </h3>
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-brand-primary text-white">
              <span className="text-[10px] font-bold uppercase">Nov</span>
              <span className="text-2xl font-bold">05</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{activity.followUp.title}</p>
              <p className="mt-1 text-sm text-gray-500">{activity.followUp.desc}</p>
              <span className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {activity.followUp.priority}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-gray-900">Farmer Insights</h3>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Last Activity</dt>
              <dd className="font-medium text-gray-900">{activity.insights.lastActivity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Days Since Last Visit</dt>
              <dd className="font-semibold text-green-600">{activity.insights.daysSinceVisit}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Farmer Risk Level</dt>
              <dd>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
                  {activity.insights.riskLevel}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Pending Tasks</dt>
              <dd>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {activity.insights.pendingTasks}
                </span>
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => navigate('/farmers')}
            className="mt-6 w-full rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            View Farmer Profile
          </button>
        </div>

        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
          <ul className="mt-6 space-y-4 border-l-2 border-gray-100 pl-4">
            {activity.timeline.map((event) => (
              <li key={event.title} className="relative">
                <span
                  className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${
                    event.done ? 'bg-brand-primary' : 'bg-gray-300'
                  }`}
                />
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
