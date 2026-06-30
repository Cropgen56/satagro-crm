import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { downloadEcommerceInvoice } from '@/lib/ecommerceInvoice'

const FULFILLMENT_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const TIMELINE = ['pending', 'confirmed', 'shipped', 'delivered']
const STEP_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

export default function OrderDetailPanel({
  order,
  onSave,
  onCancel,
  saving = false,
  cancelling = false,
  error = '',
}) {
  const [fulfillmentStatus, setFulfillmentStatus] = useState(
    order?.fulfillmentStatus || 'pending'
  )
  const [adminNotes, setAdminNotes] = useState(order?.adminNotes || '')
  const [showCancel, setShowCancel] = useState(false)
  const [cancelMode, setCancelMode] = useState('cancel_only')
  const [cancelReason, setCancelReason] = useState('')

  if (!order) return null

  const isTerminal =
    order.fulfillmentStatus === 'cancelled' || order.paymentStatus === 'refunded'
  const canCancel =
    ['pending', 'confirmed'].includes(order.fulfillmentStatus) &&
    order.fulfillmentStatus !== 'cancelled' &&
    order.paymentStatus !== 'refunded'

  useEffect(() => {
    setFulfillmentStatus(order?.fulfillmentStatus || 'pending')
    setAdminNotes(order?.adminNotes || '')
  }, [order?.fulfillmentStatus, order?.adminNotes])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave?.({ fulfillmentStatus, adminNotes })
  }

  const handleCancel = async (e) => {
    e.preventDefault()
    await onCancel?.({ mode: cancelMode, reason: cancelReason })
    setShowCancel(false)
  }

  const timelineIndex = TIMELINE.indexOf(order.fulfillmentStatus)

  return (
    <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:space-y-6 lg:col-span-2">
        <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Fulfillment timeline</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TIMELINE.map((step, idx) => (
              <div
                key={step}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  order.fulfillmentStatus === 'cancelled'
                    ? 'bg-red-50 text-red-600'
                    : idx <= timelineIndex
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {STEP_LABELS[step] || step}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Order items</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {order.items?.map((item) => (
              <li key={`${item.sku}-${item.quantity}`} className="flex justify-between gap-3 py-3 text-sm sm:py-3.5">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-500">SKU {item.sku} × {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatPrice(item.lineTotal, order.currency)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping, order.currency)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Shipping address</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p className="font-medium text-gray-900">{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.line1}</p>
            {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
              {order.shippingAddress?.pincode}
            </p>
            <p>{order.shippingAddress?.phone}</p>
          </div>
        </section>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
          <dl className="mt-4 space-y-3.5 text-sm">
            <div>
              <dt className="text-gray-500">Order number</dt>
              <dd className="font-medium text-gray-900">{order.orderNumber}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Payment</dt>
              <dd
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-700'
                    : order.paymentStatus === 'refunded'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                }`}
              >
                {order.paymentStatus}
              </dd>
            </div>
            {order.razorpayPaymentId && (
              <div>
                <dt className="text-gray-500">Razorpay payment</dt>
                <dd className="break-all text-xs text-gray-700">{order.razorpayPaymentId}</dd>
              </div>
            )}
            {order.farmer && (
              <div>
                <dt className="text-gray-500">Farmer</dt>
                <dd className="font-medium text-gray-900">
                  {`${order.farmer.firstName} ${order.farmer.lastName}`.trim()}
                </dd>
              </div>
            )}
            {order.paidAt && (
              <div>
                <dt className="text-gray-500">Paid at</dt>
                <dd className="text-gray-900">
                  {new Date(order.paidAt).toLocaleString('en-IN')}
                </dd>
              </div>
            )}
          </dl>
          {['paid', 'refunded'].includes(order.paymentStatus) && (
            <button
              type="button"
              onClick={() => downloadEcommerceInvoice(order)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Download invoice
            </button>
          )}
        </section>

        {canCancel && (
          <button
            type="button"
            onClick={() => setShowCancel(true)}
            className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            {order.paymentStatus === 'paid' ? 'Cancel / refund order' : 'Cancel order'}
          </button>
        )}

        {showCancel && (
          <form
            onSubmit={handleCancel}
            className="space-y-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 sm:p-5"
          >
            <h3 className="text-sm font-semibold text-red-800">Cancel order</h3>
            <select
              value={cancelMode}
              onChange={(e) => setCancelMode(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="cancel_only">Cancel only (no refund)</option>
              <option value="cancel_and_refund">Cancel + Razorpay refund</option>
            </select>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={cancelling}
                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Confirm cancel'}
              </button>
              <button
                type="button"
                onClick={() => setShowCancel(false)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                Back
              </button>
            </div>
          </form>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 lg:p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900">Fulfillment</h2>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={fulfillmentStatus}
              onChange={(e) => setFulfillmentStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
            >
              {FULFILLMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Admin notes</label>
            <textarea
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
            />
          </div>
          <button
            type="submit"
            disabled={saving || isTerminal}
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Update order'}
          </button>
        </form>
      </div>
    </div>
  )
}
