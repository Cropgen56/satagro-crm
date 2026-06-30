import { useCallback, useEffect, useState } from 'react'
import EcommercePageShell from '@/components/ecommerce/EcommercePageShell'
import EcommerceStatGrid from '@/components/ecommerce/EcommerceStatGrid'
import OrdersTable from '@/components/orders/OrdersTable'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchOrders, fetchOrderStats } from '@/lib/orders'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [fulfillmentStatus, setFulfillmentStatus] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const loadOrders = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        setError('')
        const res = await fetchOrders({
          page,
          limit: 20,
          ...(debouncedSearch?.trim() ? { search: debouncedSearch.trim() } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(fulfillmentStatus ? { fulfillmentStatus } : {}),
        })
        setOrders(res?.orders || [])
        setPagination(res?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load orders')
        setOrders([])
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, paymentStatus, fulfillmentStatus],
  )

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const res = await fetchOrderStats()
      setStats(res?.stats || null)
    } catch {
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    loadOrders(1)
  }, [loadOrders])

  const statCards = [
    {
      label: 'Total orders',
      value: statsLoading ? '—' : stats?.total ?? 0,
      hint: 'All shop purchases',
    },
    {
      label: 'Paid',
      value: statsLoading ? '—' : stats?.paid ?? 0,
      accent: 'border-emerald-100 bg-emerald-50/50',
      labelClass: 'text-emerald-600',
      valueClass: 'text-emerald-900',
    },
    {
      label: 'Pending payment',
      value: statsLoading ? '—' : stats?.pending ?? 0,
      accent: 'border-amber-100 bg-amber-50/50',
      labelClass: 'text-amber-700',
      valueClass: 'text-amber-900',
    },
    {
      label: 'Cancelled',
      value: statsLoading ? '—' : stats?.cancelled ?? 0,
      accent: 'border-gray-200 bg-gray-50',
      labelClass: 'text-gray-500',
    },
  ]

  return (
    <EcommercePageShell
      section="Fulfillment"
      title="Orders"
      description="Track farmer shop purchases — payment status, fulfillment progress, cancellations, and refunds."
    >
      <EcommerceStatGrid items={statCards} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <OrdersTable
        orders={orders}
        loading={loading}
        pagination={pagination}
        search={search}
        paymentStatus={paymentStatus}
        fulfillmentStatus={fulfillmentStatus}
        onSearchChange={setSearch}
        onPaymentStatusChange={setPaymentStatus}
        onFulfillmentStatusChange={setFulfillmentStatus}
        onPageChange={loadOrders}
      />
    </EcommercePageShell>
  )
}
