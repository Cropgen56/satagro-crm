import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Receipt, Search } from 'lucide-react'
import clsx from 'clsx'
import EcommercePageShell from '@/components/ecommerce/EcommercePageShell'
import EcommerceStatGrid from '@/components/ecommerce/EcommerceStatGrid'
import TablePagination from '@/components/ecommerce/TablePagination'
import {
  filterInputClass,
  filterSelectClass,
  tableCardClass,
  tableHeadClass,
  tableTdClass,
  tableThClass,
} from '@/components/ecommerce/ecommerceUi'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchShopPayments } from '@/lib/ecommercePayments'

function formatInr(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const STATUS_STYLES = {
  captured: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  refunded: 'bg-gray-100 text-gray-600 ring-gray-200',
  failed: 'bg-red-50 text-red-600 ring-red-100',
  pending: 'bg-amber-50 text-amber-700 ring-amber-100',
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className={tableTdClass}><div className="h-4 w-20 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-24 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-28 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-16 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-32 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-6 w-16 rounded-full bg-gray-100" /></td>
        </tr>
      ))}
    </>
  )
}

export default function EcommercePaymentsPage() {
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const load = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        setError('')
        const res = await fetchShopPayments({
          page,
          limit: 20,
          ...(debouncedSearch?.trim() ? { search: debouncedSearch.trim() } : {}),
          ...(status ? { status } : {}),
        })
        setPayments(res?.payments || [])
        setPagination(res?.pagination || {})
        setCurrentPage(page)
      } catch (err) {
        setError(err.message || 'Failed to load payments')
        setPayments([])
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, status],
  )

  useEffect(() => {
    load(1)
  }, [load])

  const summary = {
    captured: payments.filter((p) => p.status === 'captured').length,
    refunded: payments.filter((p) => p.status === 'refunded').length,
    failed: payments.filter((p) => p.status === 'failed').length,
  }

  const statCards = [
    {
      label: 'On this page',
      value: payments.length,
      hint: 'Current results',
    },
    {
      label: 'Captured',
      value: summary.captured,
      accent: 'border-emerald-100 bg-emerald-50/50',
      labelClass: 'text-emerald-600',
      valueClass: 'text-emerald-900',
    },
    {
      label: 'Refunded',
      value: summary.refunded,
      accent: 'border-gray-200 bg-gray-50',
    },
    {
      label: 'Failed',
      value: summary.failed,
      accent: 'border-red-100 bg-red-50/50',
      labelClass: 'text-red-600',
      valueClass: 'text-red-900',
    },
  ]

  return (
    <EcommercePageShell
      section="Billing"
      title="Payments"
      description="Shop payment and refund history from Razorpay — linked to farmer orders and transaction IDs."
    >
      <EcommerceStatGrid items={statCards} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className={tableCardClass}>
        <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search order #, payment ID, farmer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={clsx(filterInputClass, 'pl-10')}
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={clsx(filterSelectClass, 'w-full sm:w-auto')}
          >
            <option value="">All statuses</option>
            <option value="captured">Captured</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className={tableHeadClass}>
                <th className={tableThClass}>Date</th>
                <th className={tableThClass}>Order</th>
                <th className={tableThClass}>Farmer</th>
                <th className={tableThClass}>Amount</th>
                <th className={tableThClass}>Payment ID</th>
                <th className={tableThClass}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableSkeleton />
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
                        <Receipt className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-base font-semibold text-gray-900">No payments found</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Payment events appear after farmers complete Razorpay checkout.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="text-sm transition hover:bg-[#F7FAF9]/80">
                    <td className={clsx(tableTdClass, 'text-gray-600')}>
                      {formatDate(p.createdAt)}
                    </td>
                    <td className={tableTdClass}>
                      {p.orderId ? (
                        <Link
                          to={`/ecommerce/orders/${p.orderId}`}
                          className="inline-flex items-center gap-1 font-semibold text-brand-primary hover:underline"
                        >
                          {p.orderNumber || p.orderId}
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={clsx(tableTdClass, 'text-gray-700')}>
                      {p.farmer
                        ? `${p.farmer.firstName || ''} ${p.farmer.lastName || ''}`.trim()
                        : '—'}
                    </td>
                    <td className={clsx(tableTdClass, 'font-semibold text-gray-900')}>
                      {formatInr(p.amount)}
                    </td>
                    <td className={clsx(tableTdClass, 'font-mono text-xs text-gray-500')}>
                      {p.razorpayPaymentId || '—'}
                    </td>
                    <td className={tableTdClass}>
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1',
                          STATUS_STYLES[p.status] || STATUS_STYLES.pending,
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total || 0}
          limit={pagination?.limit || 20}
          onPageChange={load}
        />
      </div>
    </EcommercePageShell>
  )
}
