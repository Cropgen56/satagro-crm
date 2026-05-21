import { AlertCircle, Calendar, CheckCircle2, Clock, Plus } from 'lucide-react'

const stats = [
  { label: 'Total Tasks', value: '24', icon: CheckCircle2 },
  { label: 'Pending', value: '08', icon: Clock },
  { label: 'Completed', value: '14', icon: CheckCircle2 },
  { label: 'Overdue', value: '02', icon: AlertCircle, warn: true },
]

const tasks = [
  { name: 'Seed Sowing Review', due: 'Today', agent: 'Rahul Patil', priority: 'High', priorityClass: 'bg-red-50 text-red-700', status: 'In Progress', progress: 60, statusClass: 'bg-blue-50 text-blue-700' },
  { name: 'Soil Sample Collection', due: 'Oct 26, 2024', agent: 'Rahul Patil', priority: 'Medium', priorityClass: 'bg-amber-50 text-amber-700', status: 'Pending', progress: 0, statusClass: 'bg-gray-100 text-gray-600' },
  { name: 'Subscription Renewal Call', due: 'Oct 20, 2024', agent: 'Rahul Patil', priority: 'High', priorityClass: 'bg-red-50 text-red-700', status: 'Overdue', progress: 30, statusClass: 'bg-red-50 text-red-700' },
  { name: 'Pest Inspection Visit', due: 'Oct 28, 2024', agent: 'Rahul Patil', priority: 'Low', priorityClass: 'bg-green-50 text-green-700', status: 'Pending', progress: 0, statusClass: 'bg-gray-100 text-gray-600' },
]

export default function TasksTab() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <s.icon className={`h-5 w-5 ${s.warn ? 'text-red-500' : 'text-brand-primary'}`} />
              {s.warn && <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Farmer Tasks</h3>
            <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-950">
              <Plus className="h-4 w-4" />
              Assign Task
            </button>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.name} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{task.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Due: {task.due} · {task.agent}
                    </p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${task.priorityClass}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${task.statusClass}`}>
                    {task.status}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-brand-primary" style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Load More Tasks
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900">Upcoming Deadlines</h4>
            <div className="mt-4 rounded-lg bg-brand-light p-3">
              <p className="text-sm font-medium text-gray-900">Seed Sowing Review</p>
              <p className="text-xs text-gray-500">Due today</p>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <p className="font-bold text-red-600">2</p>
                <p className="text-xs text-gray-500">Overdue</p>
              </div>
              <div>
                <p className="font-bold text-amber-600">3</p>
                <p className="text-xs text-gray-500">Due in 24h</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900">Task Activity</h4>
            <ul className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4 text-sm">
              <li>
                <p className="font-medium text-gray-900">New Task assigned</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </li>
              <li>
                <p className="font-medium text-gray-900">Task completed</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </li>
              <li>
                <p className="font-medium text-gray-900">Comment added</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </li>
            </ul>
            <button type="button" className="mt-3 text-sm font-semibold text-brand-primary hover:underline">
              View Full History
            </button>
          </div>

          <div className="rounded-xl bg-brand-primary p-5 text-white">
            <p className="text-sm font-semibold">Efficiency Tip</p>
            <p className="mt-2 text-xs text-white/85">
              Schedule field visits during early morning for better yield prediction accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
