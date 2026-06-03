import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { UserAvatar } from '@/components/ui/EmptyState'
import UserRowActions from '@/components/usermanagement/UserRowActions'

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Email pending' },
  { value: 'verified', label: 'Awaiting login' },
  { value: 'disabled', label: 'Suspended' },
]

function normalizeStatus(value) {
  const v = String(value || '').toUpperCase()
  if (v === 'ACTIVE') return 'ACTIVE'
  if (v === 'DISABLED') return 'DISABLED'
  if (v === 'VERIFIED') return 'VERIFIED'
  return 'PENDING'
}

function displayStatus(user) {
  return user?.statusLabel || normalizeStatus(user?.status)
}

function statusBadgeClass(status) {
  const s = normalizeStatus(status)
  if (s === 'ACTIVE') return 'bg-emerald-50 text-emerald-800 ring-emerald-600/20'
  if (s === 'DISABLED') return 'bg-red-50 text-red-800 ring-red-600/20'
  if (s === 'VERIFIED') return 'bg-blue-50 text-blue-800 ring-blue-600/20'
  return 'bg-amber-50 text-amber-800 ring-amber-600/20'
}

function formatRegion(user) {
  const parts = [user.region, user.territory].filter((v) => v && v !== '—')
  const unique = [...new Set(parts)]
  return unique.length ? unique.join(' · ') : '—'
}

function contactLine(user) {
  if (user.email) return user.email
  if (user.phone) return user.phone
  return '—'
}

export default function UserManagementTable({
  users = [],
  loading = false,
  pagination = {},
  search = '',
  status = 'all',
  onPageChange,
  onStatusFilterChange,
  onSearchChange,
  onRefresh,
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
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search name, email, or phone..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onStatusFilterChange?.(f.value)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                status === f.value
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3.5">Member</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="hidden px-5 py-3.5 md:table-cell">Region</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="w-[100px] px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-sm text-gray-500">
                  <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                  <p className="mt-3">Loading team members...</p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium text-gray-900">No members found</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Try another filter or invite someone new.
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/user-management/${user.id}`)}
                  className="group cursor-pointer transition hover:bg-[#F7FAF9]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={user.name}
                        avatar={user.avatar}
                        className="h-10 w-10 shrink-0 text-sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900 group-hover:text-brand-primary">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {contactLine(user)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={clsx(
                        'inline-block max-w-[140px] truncate rounded-md px-2.5 py-1 text-xs font-semibold',
                        user.role === 'SUPER ADMIN'
                          ? 'bg-brand-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      )}
                      title={user.role}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="hidden max-w-[180px] px-5 py-4 md:table-cell">
                    <p className="truncate text-sm text-gray-700" title={formatRegion(user)}>
                      {formatRegion(user)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                        statusBadgeClass(user.status)
                      )}
                    >
                      {displayStatus(user)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => navigate(`/user-management/${user.id}/edit`)}
                        className="rounded-lg p-2 text-gray-500 opacity-0 transition hover:bg-gray-100 hover:text-brand-primary group-hover:opacity-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <UserRowActions user={user} onDeleted={onRefresh} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[2.5rem] px-2 text-center text-sm font-semibold text-gray-700">
              {currentPage}
            </span>
            <button
              type="button"
              onClick={() => movePage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
