import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageTopBar from '@/components/layout/PageTopBar'
import OrderDetailPanel from '@/components/orders/OrderDetailPanel'
import { fetchOrderById, updateOrder, cancelOrder } from '@/lib/orders'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetchOrderById(id)
        if (!cancelled) setOrder(res?.order || null)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load order')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSave = async (body) => {
    try {
      setSaving(true)
      setError('')
      const res = await updateOrder(id, body)
      setOrder(res?.order || null)
    } catch (err) {
      setError(err.message || 'Failed to update order')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async (body) => {
    try {
      setCancelling(true)
      setError('')
      const res = await cancelOrder(id, body)
      setOrder(res?.order || null)
    } catch (err) {
      setError(err.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <PageTopBar />
        <p className="text-sm text-gray-500">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <PageTopBar />
        <p className="text-sm text-red-600">{error || 'Order not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <PageTopBar />
      <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100 sm:px-5">
        <Link
          to="/ecommerce/orders"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary">
          {order.orderNumber}
        </h1>
      </div>
      <OrderDetailPanel
        order={order}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
        cancelling={cancelling}
        error={error}
      />
    </div>
  )
}
