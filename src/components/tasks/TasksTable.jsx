import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TaskPriorityBadge from './TaskPriorityBadge'
import TasksFilterBar from './TasksFilterBar'

const columns = ['Task Details', 'Farmer', 'Assigned To', 'Priority', 'Due Date']

export default function TasksTable({ tasks }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex gap-2 border-b border-gray-100 px-5 py-4">
        {['Table View', 'Kanban Board', 'Calendar View'].map((view, i) => (
          <button
            key={view}
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              i === 0 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      <TasksFilterBar />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="cursor-pointer hover:bg-gray-50/50"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-400">#{task.id}</p>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{task.farmer}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={task.agent.avatar}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{task.agent.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <TaskPriorityBadge priority={task.priority} />
                </td>
                <td className="px-5 py-4">
                  <p className={`text-sm font-medium ${task.overdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {task.dueDate}
                  </p>
                  {task.dueSub && (
                    <p className={`text-xs ${task.overdue ? 'font-semibold text-red-500' : 'text-amber-600'}`}>
                      {task.dueSub}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">4</span> of{' '}
          <span className="font-medium text-gray-700">1,248</span> tasks
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                page === 1 ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-gray-400">...</span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            125
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
