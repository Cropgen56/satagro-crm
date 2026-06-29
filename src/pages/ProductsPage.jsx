import { useCallback, useEffect, useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import ProductsHeader from '@/components/products/ProductsHeader'
import ProductsTable from '@/components/products/ProductsTable'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchProducts } from '@/lib/products'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const loadProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        setError('')
        const res = await fetchProducts({
          page,
          limit: 20,
          ...(debouncedSearch?.trim() ? { search: debouncedSearch.trim() } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        })
        setProducts(res?.products || [])
        setPagination(res?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, statusFilter]
  )

  useEffect(() => {
    loadProducts(1)
  }, [loadProducts])

  return (
    <div className="space-y-6">
      <PageTopBar />
      <ProductsHeader />
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <ProductsTable
        products={products}
        loading={loading}
        pagination={pagination}
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onPageChange={loadProducts}
      />
    </div>
  )
}
