import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  FlaskConical,
  MoreVertical,
  Phone,
  Tractor,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ActivityStatusBadge from './ActivityStatusBadge'
import ActivitiesFilterBar from './ActivitiesFilterBar'

const typeIcons = {
  flask: FlaskConical,
  tractor: Tractor,
  phone: Phone,
  users: Users,
  droplets: Droplets,
}

const columns = ['Activity', 'Farmer', 'Assigned Agent', 'Date & Time', 'Status', 'Notes', 'Actions']

export default function ActivitiesTable({ activities }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex gap-2 border-b border-gray-100 px-5 py-4">
        {['Table View', 'Timeline View', 'Calendar View'].map((view, i) => (
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

      <ActivitiesFilterBar />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
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
            {activities.map((row) => {
              const TypeIcon = typeIcons[row.typeIcon] || FlaskConical
              return (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50/50"
                  onClick={() => navigate(`/activities/${row.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <TypeIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{row.type}</p>
                        <p className="text-xs text-gray-400">{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{row.farmer.name}</p>
                    <p className="text-xs text-gray-400">{row.farmer.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={row.agent.avatar}
                        alt=""
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">{row.agent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{row.dateTime}</td>
                  <td className="px-5 py-4">
                    <ActivityStatusBadge status={row.status} />
                  </td>
                  <td className="max-w-[200px] truncate px-5 py-4 text-sm text-gray-500">{row.notes}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100"
                      aria-label="More"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">1</span> to{' '}
          <span className="font-medium text-gray-700">10</span> of{' '}
          <span className="font-medium text-gray-700">1,248</span> activities
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
