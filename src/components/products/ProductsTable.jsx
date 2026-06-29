import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-amber-50 text-amber-700',
  archived: 'bg-gray-100 text-gray-600',
}

function formatPrice(priceMinor, currency = 'INR') {
  if (priceMinor == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(priceMinor / 100)
}

export default function ProductsTable({
  products = [],
  loading = false,
  pagination = {},
  search = '',
  statusFilter = '',
  onSearchChange,
  onStatusFilterChange,
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
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange?.(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">SKU</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="transition hover:bg-[#F7FAF9]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          —
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(product.priceMinor, product.currency)}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.stockQuantity == null ? 'Unlimited' : product.stockQuantity}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[product.status] || STATUS_STYLES.draft}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
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
