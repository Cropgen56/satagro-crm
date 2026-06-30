import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import EcommercePageShell from '@/components/ecommerce/EcommercePageShell'
import ProductsTable from '@/components/products/ProductsTable'
import { primaryButtonClass } from '@/components/ecommerce/ecommerceUi'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { deleteProduct, fetchProducts } from '@/lib/products'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deletingProductId, setDeletingProductId] = useState('')
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
    [debouncedSearch, statusFilter],
  )

  useEffect(() => {
    loadProducts(1)
  }, [loadProducts])

  const handleDeleteProduct = async (product) => {
    if (!product?.id) return
    if (!product.canDelete) {
      setError('This product cannot be deleted because pending orders exist.')
      return
    }

    const ok = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    )
    if (!ok) return

    try {
      setDeletingProductId(product.id)
      setError('')
      await deleteProduct(product.id)
      await loadProducts(pagination?.page || 1)
    } catch (err) {
      setError(err.message || 'Failed to delete product')
    } finally {
      setDeletingProductId('')
    }
  }

  return (
    <EcommercePageShell
      section="Catalog"
      title="Products"
      description="Manage BioDrops shop catalog — prices, stock, images, and availability for farmers."
      action={
        <button
          type="button"
          onClick={() => navigate('/ecommerce/products/new')}
          className={primaryButtonClass}
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      }
    >
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <ProductsTable
        products={products}
        loading={loading}
        pagination={pagination}
        search={search}
        statusFilter={statusFilter}
        deletingProductId={deletingProductId}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onPageChange={loadProducts}
        onDeleteProduct={handleDeleteProduct}
        emptyIcon={Package}
        emptyTitle="No products yet"
        emptyDescription="Create your first shop listing to make it available in the BioDrops farmer app."
        onEmptyAction={() => navigate('/ecommerce/products/new')}
      />
    </EcommercePageShell>
  )
}
