import { useCallback, useEffect, useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import OrdersTable from '@/components/orders/OrdersTable'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchOrders } from '@/lib/orders'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
    [debouncedSearch, paymentStatus, fulfillmentStatus]
  )

  useEffect(() => {
    loadOrders(1)
  }, [loadOrders])

  return (
    <div className="space-y-6">
      <PageTopBar />
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[26px]">
          Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Farmer shop purchases — track payment and fulfillment.
        </p>
      </header>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
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
    </div>
  )
}
