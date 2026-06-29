import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageTopBar from '@/components/layout/PageTopBar'
import OrderDetailPanel from '@/components/orders/OrderDetailPanel'
import { fetchOrderById, updateOrder } from '@/lib/orders'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <PageTopBar />
        <p className="text-sm text-gray-500">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <PageTopBar />
        <p className="text-sm text-red-600">{error || 'Order not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageTopBar />
      <div>
        <Link
          to="/orders"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary">
          {order.orderNumber}
        </h1>
      </div>
      <OrderDetailPanel order={order} onSave={handleSave} saving={saving} error={error} />
    </div>
  )
}
