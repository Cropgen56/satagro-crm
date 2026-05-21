import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LeadStatusBadge from './LeadStatusBadge'
import LeadsFilterBar from './LeadsFilterBar'

const columns = ['Lead Info', 'Mobile Number', 'Location', 'Status', 'Assigned Agent', 'Follow-up', 'Actions']

export default function LeadsTable({ leads }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <LeadsFilterBar />

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
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-400">ID: {lead.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{lead.phone}</td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">{lead.state}</p>
                  <p className="text-xs text-gray-500">{lead.city}</p>
                </td>
                <td className="px-5 py-4">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${lead.agent.color}`}
                    >
                      {lead.agent.initials}
                    </span>
                    <span className="text-sm text-gray-600">{lead.agent.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-amber-600">{lead.followUpDate}</p>
                  <p className="text-xs text-gray-500">{lead.followUpLabel}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      VIEW
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/leads/${lead.id}/convert`)}
                      className="rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-950"
                    >
                      CONVERT
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
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
          <span className="font-medium text-gray-700">10</span> of{' '}
          <span className="font-medium text-gray-700">642</span> leads
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
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
            65
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
