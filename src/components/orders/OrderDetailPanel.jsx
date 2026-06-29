import { useState } from 'react'

const FULFILLMENT_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

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
  saving = false,
  error = '',
}) {
  const [fulfillmentStatus, setFulfillmentStatus] = useState(
    order?.fulfillmentStatus || 'pending'
  )
  const [adminNotes, setAdminNotes] = useState(order?.adminNotes || '')

  if (!order) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave?.({ fulfillmentStatus, adminNotes })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Order items</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {order.items?.map((item) => (
              <li key={`${item.sku}-${item.quantity}`} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-500">
                    SKU {item.sku} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatPrice(item.lineTotal, order.currency)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-1 text-sm">
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

        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Shipping address</h2>
          <div className="mt-3 text-sm text-gray-600 space-y-1">
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

      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Order number</dt>
              <dd className="font-medium text-gray-900">{order.orderNumber}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Payment</dt>
              <dd className="font-medium capitalize text-gray-900">{order.paymentStatus}</dd>
            </div>
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
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-4"
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
            disabled={saving}
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Update order'}
          </button>
        </form>
      </div>
    </div>
  )
}
