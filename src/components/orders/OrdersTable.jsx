import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

const PAYMENT_STYLES = {
  paid: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

const FULFILLMENT_STYLES = {
  pending: 'bg-gray-100 text-gray-600',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
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

  const movePage = (next) => {
    const page = Math.min(Math.max(1, next), totalPages)
    setCurrentPage(page)
    onPageChange?.(page)
  }

  const rangeStart = total ? (currentPage - 1) * limit + 1 : 0
  const rangeEnd = Math.min(currentPage * limit, total)

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center">
        <input
          type="search"
          placeholder="Search order #, name, phone..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
        />
        <select
          value={paymentStatus}
          onChange={(e) => onPaymentStatusChange?.(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
        >
          <option value="">All payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={fulfillmentStatus}
          onChange={(e) => onFulfillmentStatusChange?.(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
        >
          <option value="">All fulfillment</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3.5">Order</th>
              <th className="px-5 py-3.5">Farmer</th>
              <th className="px-5 py-3.5">Total</th>
              <th className="px-5 py-3.5">Payment</th>
              <th className="px-5 py-3.5">Fulfillment</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-[#F7FAF9]">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {order.farmer
                        ? `${order.farmer.firstName} ${order.farmer.lastName}`.trim()
                        : '—'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.farmer?.phone || order.shippingAddress?.phone}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${PAYMENT_STYLES[order.paymentStatus] || PAYMENT_STYLES.pending}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${FULFILLMENT_STYLES[order.fulfillmentStatus] || FULFILLMENT_STYLES.pending}`}
                    >
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm text-gray-600">
          <span>
            {rangeStart}–{rangeEnd} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => movePage(currentPage - 1)}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => movePage(currentPage + 1)}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
