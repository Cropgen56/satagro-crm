import { ChevronLeft, ChevronRight, Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FarmersFilterBar from './FarmersFilterBar'
import StatusBadge from './StatusBadge'

const columns = [
  'Farmer',
  'Mobile Number',
  'Location',
  'Land Size',
  'Crop',
  'Assigned Agent',
  'Status',
  'Last Advisory',
  'Actions',
]

export default function FarmersTable({ farmers }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <FarmersFilterBar />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
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
            {farmers.map((farmer) => (
              <tr key={farmer.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={farmer.avatar}
                      alt={farmer.name}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{farmer.name}</p>
                      <p className="text-xs text-gray-400">{farmer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{farmer.phone}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{farmer.location}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{farmer.landSize}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{farmer.crop}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${farmer.agent.color}`}
                    >
                      {farmer.agent.initials}
                    </span>
                    <span className="text-sm text-gray-600">{farmer.agent.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={farmer.status} />
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{farmer.lastAdvisory}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/farmers/${farmer.id}`)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      aria-label="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      aria-label="More"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">1</span> to{' '}
          <span className="font-medium text-gray-700">5</span> of{' '}
          <span className="font-medium text-gray-700">12,458</span> farmers
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                page === 1
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
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
            2492
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
