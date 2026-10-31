import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchMyClientFarms, formatCredits, formatDate } from '@/lib/clientCredits'

const TABS = [
  { id: 'pending', label: 'Awaiting activation' },
  { id: 'active', label: 'Activated' },
  { id: 'all', label: 'All farms' },
]

const SOURCE_LABELS = {
  client_credits: 'Your credits',
  razorpay: 'Paid by farmer',
  product_card: 'Product card',
  hybrid: 'Product card',
  admin: 'SatAgro admin',
  demo_key: 'Demo',
}

const TD = 'px-5 py-3.5 text-sm'

/**
 * The client's farmers' farms with their subscription state. Farms are
 * locked until the client activates them here. `refreshKey` reloads the list.
 */
export default function FarmActivationsPanel({ refreshKey, onActivate }) {
  const [status, setStatus] = useState('pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => {
    setPage(1)
  }, [status, debouncedSearch])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMyClientFarms({ status, search: debouncedSearch, page, limit: 10 })
      .then((res) => {
        if (cancelled) return
        setData(res)
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message || 'Failed to load farms'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [status, debouncedSearch, page, refreshKey])

  const farms = data?.farms || []
  const counts = data?.counts || {}
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages || 1

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Farm activations</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            New farms stay locked until you activate their subscription here.
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farmer, phone or farm"
            className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50/80 pl-9 pr-3 text-sm outline-none focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
          />
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-100 px-5 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setStatus(t.id)}
            className={clsx(
              'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              status === t.id ? 'bg-[#E7EFEC] text-brand-primary' : 'text-gray-500 hover:text-gray-800',
            )}
          >
            {t.label}
            {counts[t.id] != null ? (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px]',
                  t.id === 'pending' && counts.pending > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-500',
                )}
              >
                {counts[t.id]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {error ? <p className="mx-5 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {['Farmer', 'Farm', 'Size', 'Credits', 'Added on', 'Status', ''].map((col) => (
                <th key={col || 'action'} className="px-5 py-3.5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && !data ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-500">
                  Loading farms…
                </td>
              </tr>
            ) : farms.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-500">
                  {status === 'pending'
                    ? 'No farms are waiting for activation.'
                    : 'No farms found.'}
                </td>
              </tr>
            ) : (
              farms.map((farm) => (
                <tr key={farm.fieldId} className={clsx('hover:bg-gray-50/60', loading && 'opacity-60')}>
                  <td className={clsx(TD, 'font-medium text-gray-900')}>
                    {farm.farmer.name}
                    {farm.farmer.phone ? (
                      <span className="block text-xs font-normal text-gray-400">{farm.farmer.phone}</span>
                    ) : null}
                  </td>
                  <td className={TD}>{farm.fieldName}</td>
                  <td className={clsx(TD, 'text-gray-600')}>
                    {formatCredits(farm.hectares)} ha
                    <span className="block text-xs text-gray-400">{formatCredits(farm.acres)} acres</span>
                  </td>
                  <td className={clsx(TD, 'font-semibold text-gray-900')}>{formatCredits(farm.creditsNeeded)}</td>
                  <td className={clsx(TD, 'text-gray-600')}>{formatDate(farm.addedAt)}</td>
                  <td className={TD}>
                    {farm.status === 'active' ? (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        Locked
                      </span>
                    )}
                    {farm.subscription ? (
                      <span className="mt-1 block text-xs text-gray-400">
                        {SOURCE_LABELS[farm.subscription.activationSource] || farm.subscription.activationSource}
                        {farm.subscription.endDate ? ` · until ${formatDate(farm.subscription.endDate)}` : ''}
                      </span>
                    ) : null}
                  </td>
                  <td className={clsx(TD, 'text-right')}>
                    {farm.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => onActivate(farm)}
                        className="rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-950"
                      >
                        Activate
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          <span>
            Page {pagination.page} of {totalPages} · {pagination.total} farms
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
