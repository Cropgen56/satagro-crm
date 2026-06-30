import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ExternalLink, FileText, Search } from 'lucide-react'
import clsx from 'clsx'
import EcommercePageShell from '@/components/ecommerce/EcommercePageShell'
import EcommerceStatGrid from '@/components/ecommerce/EcommerceStatGrid'
import {
  actionButtonClass,
  filterInputClass,
  tableCardClass,
  tableHeadClass,
  tableTdClass,
  tableThClass,
} from '@/components/ecommerce/ecommerceUi'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchOrders } from '@/lib/orders'
import { downloadEcommerceInvoice } from '@/lib/ecommerceInvoice'

function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className={tableTdClass}><div className="h-4 w-24 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-28 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-20 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-16 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="ml-auto h-8 w-24 rounded-xl bg-gray-100" /></td>
        </tr>
      ))}
    </>
  )
}

export default function EcommerceInvoicesPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetchOrders({
        page: 1,
        limit: 50,
        paymentStatus: 'paid',
        ...(debouncedSearch?.trim() ? { search: debouncedSearch.trim() } : {}),
      })
      const paid = (res?.orders || []).filter((o) =>
        ['paid', 'refunded'].includes(o.paymentStatus),
      )
      setOrders(paid)
    } catch (err) {
      setError(err.message || 'Failed to load invoices')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.paymentStatus === 'paid').length
    const refunded = orders.filter((o) => o.paymentStatus === 'refunded').length
    const totalValue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    return { paid, refunded, totalValue }
  }, [orders])

  const statCards = [
    {
      label: 'Invoiceable orders',
      value: orders.length,
      hint: 'Paid or refunded',
    },
    {
      label: 'Paid',
      value: stats.paid,
      accent: 'border-emerald-100 bg-emerald-50/50',
      labelClass: 'text-emerald-600',
      valueClass: 'text-emerald-900',
    },
    {
      label: 'Refunded',
      value: stats.refunded,
      accent: 'border-gray-200 bg-gray-50',
    },
    {
      label: 'Total value',
      value: formatInr(stats.totalValue),
      accent: 'border-brand-primary/10 bg-brand-light/40',
      labelClass: 'text-brand-primary/70',
      valueClass: 'text-brand-primary text-xl',
    },
  ]

  return (
    <EcommercePageShell
      section="Documents"
      title="Invoices"
      description="Download printable invoices for paid BioDrops shop orders — includes line items, farmer details, and payment reference."
    >
      <EcommerceStatGrid items={statCards} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className={tableCardClass}>
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search order #, farmer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={clsx(filterInputClass, 'pl-10')}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className={tableHeadClass}>
                <th className={tableThClass}>Order</th>
                <th className={tableThClass}>Farmer</th>
                <th className={tableThClass}>Paid on</th>
                <th className={tableThClass}>Total</th>
                <th className={clsx(tableThClass, 'text-right')}>Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableSkeleton />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16">
                    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-base font-semibold text-gray-900">No invoices yet</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Invoices become available once farmers complete payment for shop orders.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="text-sm transition hover:bg-[#F7FAF9]/80">
                    <td className={tableTdClass}>
                      <Link
                        to={`/ecommerce/orders/${order.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-brand-primary hover:underline"
                      >
                        {order.orderNumber}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </Link>
                      {order.paymentStatus === 'refunded' ? (
                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Refunded
                        </span>
                      ) : null}
                    </td>
                    <td className={clsx(tableTdClass, 'text-gray-700')}>
                      {order.farmer
                        ? `${order.farmer.firstName || ''} ${order.farmer.lastName || ''}`.trim()
                        : order.shippingAddress?.name || '—'}
                    </td>
                    <td className={clsx(tableTdClass, 'text-gray-600')}>
                      {formatDate(order.paidAt)}
                    </td>
                    <td className={clsx(tableTdClass, 'font-semibold text-gray-900')}>
                      {formatInr(order.total)}
                    </td>
                    <td className={clsx(tableTdClass, 'text-right')}>
                      <button
                        type="button"
                        onClick={() => downloadEcommerceInvoice(order)}
                        className={actionButtonClass}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </EcommercePageShell>
  )
}
