import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { UserAvatar } from '@/components/ui/EmptyState'
import FarmersFilterBar from './FarmersFilterBar'
import StatusBadge from './StatusBadge'

const columns = [
  'Farmer',
  'Mobile',
  'Location',
  'Land',
  'Crop',
  'Account',
  'Last active',
  '',
]

export default function FarmersTable({
  farmers = [],
  loading = false,
  pagination = {},
  search = '',
  onSearchChange,
  onPageChange,
}) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1)
  const totalPages = pagination?.totalPages || 1
  const limit = pagination?.limit || 20
  const total = pagination?.total || 0

  useEffect(() => {
    setCurrentPage(pagination?.page || 1)
  }, [pagination?.page])

  const movePage = (next) => {
    const page = Math.min(Math.max(1, next), totalPages)
    setCurrentPage(page)
    onPageChange?.(page)
  }

  const rangeStart = total ? (currentPage - 1) * limit + 1 : 0
  const rangeEnd = Math.min(currentPage * limit, total)

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <FarmersFilterBar search={search} onSearchChange={onSearchChange} />

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {columns.map((col) => (
                <th key={col || 'actions'} className="px-5 py-3.5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center text-sm text-gray-500">
                  Loading farmers...
                </td>
              </tr>
            ) : farmers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-500">
                  No farmers match your search.
                </td>
              </tr>
            ) : (
              farmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  className="cursor-pointer transition hover:bg-[#F7FAF9]"
                  onClick={() => navigate(`/farmers/${farmer.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={farmer.name}
                        avatar={farmer.avatar}
                        className="h-10 w-10 shrink-0 text-sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {farmer.name}
                        </p>
                        <p className="text-xs text-gray-400">{farmer.uid}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{farmer.phone}</td>
                  <td className="max-w-[200px] px-5 py-4">
                    <p className="truncate text-sm text-gray-600" title={farmer.location}>
                      {farmer.location}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {farmer.landSize}
                    {farmer.fieldCount > 0 ? (
                      <span className="block text-xs text-gray-400">
                        {farmer.fieldCount} plot{farmer.fieldCount !== 1 ? 's' : ''}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{farmer.crop}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={farmer.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {farmer.lastAdvisory}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/farmers/${farmer.id}`)
                      }}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-primary"
                      aria-label="View farmer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 ? (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            {rangeStart}–{rangeEnd} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => movePage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] px-2 text-center text-sm font-semibold text-gray-700">
              {currentPage}
            </span>
            <button
              type="button"
              onClick={() => movePage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200',
                currentPage >= totalPages && 'opacity-40'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
