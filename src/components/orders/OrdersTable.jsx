import { useNavigate } from 'react-router-dom'
import { Eye, Search, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import TablePagination from '@/components/ecommerce/TablePagination'
import {
  actionButtonClass,
  filterInputClass,
  filterSelectClass,
  tableCardClass,
  tableHeadClass,
  tableTdClass,
  tableThClass,
} from '@/components/ecommerce/ecommerceUi'

const PAYMENT_STYLES = {
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  pending: 'bg-amber-50 text-amber-700 ring-amber-100',
  failed: 'bg-red-50 text-red-700 ring-red-100',
  refunded: 'bg-gray-100 text-gray-600 ring-gray-200',
}

const FULFILLMENT_STYLES = {
  pending: 'bg-gray-100 text-gray-600 ring-gray-200',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-100',
  shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  cancelled: 'bg-red-50 text-red-700 ring-red-100',
}

function formatPrice(amount, currency = 'INR') {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
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

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className={tableTdClass}><div className="h-4 w-24 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-8 w-32 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-16 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-6 w-14 rounded-full bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-6 w-16 rounded-full bg-gray-100" /></td>
          <td className={tableTdClass}><div className="h-4 w-20 rounded bg-gray-100" /></td>
          <td className={tableTdClass}><div className="ml-auto h-8 w-16 rounded-xl bg-gray-100" /></td>
        </tr>
      ))}
    </>
  )
}

export default function OrdersTable({
  orders = [],
  loading = false,
  pagination = {},
  search = '',
  paymentStatus = '',
  fulfillmentStatus = '',
  onSearchChange,
  onPaymentStatusChange,
  onFulfillmentStatusChange,
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  return (
    <div className={tableCardClass}>
      <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search order #, name, phone..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className={clsx(filterInputClass, 'pl-10')}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={paymentStatus}
            onChange={(e) => onPaymentStatusChange?.(e.target.value)}
            className={filterSelectClass}
          >
            <option value="">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={fulfillmentStatus}
            onChange={(e) => onFulfillmentStatusChange?.(e.target.value)}
            className={filterSelectClass}
          >
            <option value="">All fulfillment</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className={tableHeadClass}>
              <th className={tableThClass}>Order</th>
              <th className={tableThClass}>Farmer</th>
              <th className={tableThClass}>Total</th>
              <th className={tableThClass}>Payment</th>
              <th className={tableThClass}>Fulfillment</th>
              <th className={tableThClass}>Date</th>
              <th className={clsx(tableThClass, 'text-right')}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <TableSkeleton />
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16">
                  <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-gray-900">No orders found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Orders appear here when farmers purchase from the BioDrops shop.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-[#F7FAF9]/80">
                  <td className={clsx(tableTdClass, 'text-sm font-semibold text-gray-900')}>
                    {order.orderNumber}
                  </td>
                  <td className={tableTdClass}>
                    <p className="text-sm font-medium text-gray-900">
                      {order.farmer
                        ? `${order.farmer.firstName} ${order.farmer.lastName}`.trim()
                        : order.shippingAddress?.name || '—'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.farmer?.phone || order.shippingAddress?.phone || '—'}
                    </p>
                  </td>
                  <td className={clsx(tableTdClass, 'text-sm font-semibold text-gray-900')}>
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className={tableTdClass}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1',
                        PAYMENT_STYLES[order.paymentStatus] || PAYMENT_STYLES.pending,
                      )}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className={tableTdClass}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1',
                        FULFILLMENT_STYLES[order.fulfillmentStatus] || FULFILLMENT_STYLES.pending,
                      )}
                    >
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className={clsx(tableTdClass, 'text-sm text-gray-600')}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td className={clsx(tableTdClass, 'text-right')}>
                    <button
                      type="button"
                      onClick={() => navigate(`/ecommerce/orders/${order.id}`)}
                      className={actionButtonClass}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
