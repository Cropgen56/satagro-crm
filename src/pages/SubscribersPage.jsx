import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import { UserAvatar } from '@/components/ui/EmptyState'
import { fetchSubscribers } from '@/lib/subscriptions'
import { downloadSubscriptionBill } from '@/lib/subscriptionBill'
import { Download, Eye, Users } from 'lucide-react'
import clsx from 'clsx'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  expired: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-50 text-red-600',
}

const SOURCE_LABELS = {
  razorpay: 'Razorpay',
  product_card: 'Product card',
  hybrid: 'Card + Razorpay',
  admin: 'Admin',
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function daysUntilExpiry(endDate) {
  if (!endDate) return null
  const diff = new Date(endDate).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

export default function SubscribersPage() {
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({})
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        setError('')
        const res = await fetchSubscribers({
          page,
          limit: 25,
          ...(status ? { status } : {}),
          ...(search.trim() ? { search: search.trim() } : {}),
        })
        setRows(res?.data || [])
        setPagination(res?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load subscribers')
        setRows([])
      } finally {
        setLoading(false)
      }
    },
    [status, search],
  )

  useEffect(() => {
    const timer = setTimeout(() => load(1), search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [load, search])

  const stats = useMemo(() => {
    const active = rows.filter((r) => r.status === 'active').length
    const expiringSoon = rows.filter((r) => {
      const days = daysUntilExpiry(r.endDate)
      return r.status === 'active' && days != null && days >= 0 && days <= 7
    }).length
    const pendingRemainder = rows.filter(
      (r) =>
        r.status === 'pending' &&
        r.activationSource === 'hybrid' &&
        r.subscriptionPhase === 'card_remainder_pending' &&
        (r.pendingAdminAcres || 0) > 0,
    ).length
    return { active, expiringSoon, pendingRemainder }
  }, [rows])

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <header className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[28px]">
          Subscribers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Farmers with active or past field subscriptions — plan, billing, and
          expiry
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-3xl">
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Active on this page
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Expiring within 7 days
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.expiringSoon}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
            Card remainder pending
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-900">
            {stats.pendingRemainder}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value || 'all'}
              type="button"
              onClick={() => setStatus(item.value)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                status === item.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search farmer name or phone"
          className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm sm:w-64"
        />
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-sm text-gray-500">
            Loading subscribers…
          </p>
        ) : rows.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="No subscribers yet"
              description="Field subscriptions will appear here when farmers pay via Razorpay or redeem a product card."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#FAFAFA] text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Field</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Billing</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => {
                  const daysLeft = daysUntilExpiry(row.endDate)
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/80"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            name={row.farmer?.name}
                            avatar={row.farmer?.avatar}
                            className="h-9 w-9 text-xs"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">
                              {row.farmer?.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {row.farmer?.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {row.field?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {row.acres || row.field?.acres} ac
                          {row.cardAcres > 0 ? ` · ${row.cardAcres} ac card` : ''}
                          {row.pendingAdminAcres > 0
                            ? ` · ${row.pendingAdminAcres} ac pending`
                            : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {row.plan?.name}
                        </p>
                        <p className="text-xs text-gray-400">{row.plan?.slug}</p>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-700">
                        {row.billingLabel}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {row.amount}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{formatDate(row.startDate)}</p>
                        <p className="text-xs text-gray-400">
                          to {formatDate(row.endDate)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {daysLeft == null ? (
                          <span className="text-gray-400">—</span>
                        ) : daysLeft < 0 ? (
                          <span className="text-red-600">Expired</span>
                        ) : (
                          <span
                            className={clsx(
                              daysLeft <= 7
                                ? 'font-medium text-amber-700'
                                : 'text-gray-700',
                            )}
                          >
                            {daysLeft}d left
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                            STATUS_STYLES[row.status] || STATUS_STYLES.pending,
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {SOURCE_LABELS[row.activationSource] ||
                          row.activationSource}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => downloadSubscriptionBill(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            title="Download subscription bill"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Bill
                          </button>
                          {row.farmer?.id ? (
                            <Link
                              to={`/farmers/${row.farmer.id}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-light/40"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.total > pagination.limit ? (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <p>
            Page {pagination.page} of {pagination.totalPages} ·{' '}
            {pagination.total} total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => load(pagination.page - 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={
                pagination.page >= pagination.totalPages || loading
              }
              onClick={() => load(pagination.page + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
