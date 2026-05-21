import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

function Field({ label, value, className = '' }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1 text-sm font-medium text-gray-900 ${className}`}>{value}</p>
    </div>
  )
}

export default function TaskOverviewTab({ task }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className={cardClass}>
            <h3 className="text-sm font-semibold text-gray-900">Task Information</h3>
            <dl className="mt-4 space-y-4">
              <Field label="Task Type" value={task.info.type} />
              <Field label="Description" value={task.info.description} />
              <Field label="Created" value={task.info.created} />
              <Field label="Due Date" value={task.info.dueDate} />
            </dl>
          </div>

          <div className={cardClass}>
            <h3 className="text-sm font-semibold text-gray-900">Related Farmer</h3>
            <div className="mt-4 flex items-center gap-3">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${task.farmer.color}`}
              >
                {task.farmer.initials}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{task.farmer.name}</p>
                <p className="text-xs text-gray-500">ID: {task.farmer.id}</p>
                <p className="text-xs text-gray-500">Village: {task.farmer.village}</p>
                <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                  {task.farmer.tier}
                </span>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-sm font-semibold text-gray-900">Assignment Details</h3>
            <dl className="mt-4 space-y-3">
              <Field label="Assigned by" value={task.assignment.assignedBy} />
              <Field label="Assigned to" value={task.assignment.assignedTo} />
              <Field label="Assigned on" value={task.assignment.assignedOn} />
            </dl>
          </div>

          <div className={cardClass}>
            <h3 className="text-sm font-semibold text-gray-900">Progress Tracking</h3>
            <p className="mt-4 text-xs font-semibold uppercase text-gray-400">
              Current Status: {task.progress}%
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-primary"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase text-gray-400">Status History</p>
            <p className="mt-1 text-sm text-gray-600">{task.statusHistory}</p>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          <ul className="mt-6 space-y-4 border-l-2 border-gray-100 pl-4">
            {task.activities.map((item) => (
              <li key={item.title + item.time} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                {item.detail && <p className="text-sm text-gray-600">{item.detail}</p>}
                <p className="text-xs text-gray-500">{item.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-gray-900">Quick Insights</h3>
          <div className="mt-4 rounded-lg bg-green-50 p-3">
            <p className="text-xs text-gray-500">Farmer Risk Level</p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {task.insights.riskLevel}
            </p>
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase text-gray-400">Key Deadlines</p>
          <ul className="mt-2 space-y-2">
            {task.insights.deadlines.map((d) => (
              <li key={d.label} className="flex justify-between text-sm">
                <span className="text-gray-600">{d.label}</span>
                <span className={d.urgent ? 'font-semibold text-red-600' : 'text-gray-500'}>
                  {d.due}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">{task.insights.lastActivity}</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Pending Tasks</h3>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
              {task.pendingTasks.length}
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {task.pendingTasks.map((t) => (
              <li key={t.title} className="flex items-start gap-2">
                <span className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.title}</p>
                  <p className="text-xs text-gray-500">Due: {t.due}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="mt-4 text-sm font-semibold text-brand-primary hover:underline"
          >
            View All Tasks
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <img src={task.mapImage} alt="Location" className="h-40 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Sector A & B</p>
              <p className="text-xs text-white/80">Nandi Valley Operations Zone</p>
            </div>
            <MapPin className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
