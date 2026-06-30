import { useNavigate } from 'react-router-dom'
import { ImageIcon, Pencil, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import TablePagination from '@/components/ecommerce/TablePagination'
import {
  actionButtonClass,
  filterInputClass,
  filterSelectClass,
  primaryButtonClass,
  tableCardClass,
  tableHeadClass,
  tableTdClass,
  tableThClass,
} from '@/components/ecommerce/ecommerceUi'

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  draft: 'bg-amber-50 text-amber-700 ring-amber-100',
  archived: 'bg-gray-100 text-gray-600 ring-gray-200',
}

function formatPrice(priceMinor, currency = 'INR') {
  if (priceMinor == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(priceMinor / 100)
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className={tableTdClass}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gray-100" />
              <div className="space-y-2">
                <div className="h-4 w-36 rounded bg-gray-100" />
                <div className="h-3 w-24 rounded bg-gray-100" />
              </div>
            </div>
          </td>
          <td className={tableTdClass}>
            <div className="h-4 w-20 rounded bg-gray-100" />
          </td>
          <td className={tableTdClass}>
            <div className="h-4 w-16 rounded bg-gray-100" />
          </td>
          <td className={tableTdClass}>
            <div className="h-4 w-14 rounded bg-gray-100" />
          </td>
          <td className={tableTdClass}>
            <div className="h-6 w-16 rounded-full bg-gray-100" />
          </td>
          <td className={tableTdClass}>
            <div className="ml-auto h-8 w-16 rounded-xl bg-gray-100" />
          </td>
        </tr>
      ))}
    </>
  )
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
  emptyIcon: EmptyIcon = ImageIcon,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search or filters.',
  onEmptyAction,
  onDeleteProduct,
  deletingProductId = '',
}) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1)
  const totalPages = pagination?.totalPages || 1
  const limit = pagination?.limit || 20
  const total = pagination?.total || 0

  useEffect(() => {
    setCurrentPage(pagination?.page || 1)
  }, [pagination?.page])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  return (
    <div className={tableCardClass}>
      <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className={clsx(filterInputClass, 'pl-10')}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange?.(e.target.value)}
          className={clsx(filterSelectClass, 'w-full sm:w-auto')}
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
            <tr className={tableHeadClass}>
              <th className={tableThClass}>Product</th>
              <th className={tableThClass}>SKU</th>
              <th className={tableThClass}>Price</th>
              <th className={tableThClass}>Stock</th>
              <th className={tableThClass}>Status</th>
              <th className={clsx(tableThClass, 'text-right')}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <TableSkeleton />
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16">
                  <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
                      <EmptyIcon className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-gray-900">{emptyTitle}</p>
                    <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
                    {onEmptyAction ? (
                      <button
                        type="button"
                        onClick={onEmptyAction}
                        className={clsx(primaryButtonClass, 'mt-5')}
                      >
                        Add product
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="transition hover:bg-[#F7FAF9]/80">
                  <td className={tableTdClass}>
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-11 w-11 rounded-xl border border-gray-100 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-300 ring-1 ring-gray-100">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">{product.name}</p>
                        <p className="truncate text-xs text-gray-500">
                          {product.tagline || 'No tagline'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={clsx(tableTdClass, 'font-mono text-sm text-gray-600')}>
                    {product.sku}
                  </td>
                  <td className={clsx(tableTdClass, 'text-sm font-semibold text-gray-900')}>
                    {formatPrice(product.priceMinor, product.currency)}
                  </td>
                  <td className={clsx(tableTdClass, 'text-sm text-gray-600')}>
                    {product.stockQuantity == null ? (
                      <span className="text-gray-500">Unlimited</span>
                    ) : (
                      <span className="font-medium text-gray-800">{product.stockQuantity}</span>
                    )}
                    {product.stockQuantity != null &&
                      product.lowStockThreshold != null &&
                      product.stockQuantity <= product.lowStockThreshold && (
                        <span className="ml-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-100">
                          Low
                        </span>
                      )}
                  </td>
                  <td className={tableTdClass}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1',
                        STATUS_STYLES[product.status] || STATUS_STYLES.draft,
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className={clsx(tableTdClass, 'text-right')}>
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/ecommerce/products/${product.id}/edit`)}
                        className={actionButtonClass}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={!product.canDelete || deletingProductId === product.id}
                        title={
                          product.canDelete
                            ? 'Delete product'
                            : 'Pending orders exist for this product'
                        }
                        onClick={() => onDeleteProduct?.(product)}
                        className={clsx(
                          actionButtonClass,
                          'text-red-700',
                          (!product.canDelete || deletingProductId === product.id) &&
                            'cursor-not-allowed opacity-50',
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
