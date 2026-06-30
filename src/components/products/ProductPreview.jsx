import clsx from 'clsx'
import { ImageIcon, Leaf, ShoppingBag, Sparkles } from 'lucide-react'

const UNIT_LABELS = {
  per_unit: 'per unit',
  per_liter: 'per liter',
  per_kg: 'per kg',
  per_acre: 'per acre',
}

const CATEGORY_LABELS = {
  biofertilizer: 'Biofertilizer',
  compost: 'Compost',
  fungicide: 'Fungicide',
  disease_control: 'Disease control',
  other: 'Other',
}

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-emerald-50 text-emerald-700',
  archived: 'bg-amber-50 text-amber-700',
}

function formatInr(value) {
  const n = parseFloat(value)
  if (!Number.isFinite(n) || n <= 0) return '₹—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ProductPreview({ form }) {
  const cover = form.images?.[0]?.url
  const price = formatInr(form.price)
  const unit = UNIT_LABELS[form.unit] || 'per unit'
  const category = CATEGORY_LABELS[form.category] || 'Other'
  const stockLabel = form.unlimitedStock
    ? 'In stock'
    : form.stockQuantity === '' || form.stockQuantity == null
      ? 'Stock not set'
      : Number(form.stockQuantity) <= 0
        ? 'Out of stock'
        : form.lowStockThreshold &&
            Number(form.stockQuantity) <= Number(form.lowStockThreshold)
          ? `Low stock · ${form.stockQuantity} left`
          : `${form.stockQuantity} in stock`

  return (
    <div className="sticky top-6 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <ShoppingBag className="h-3.5 w-3.5" />
        Farmer shop preview
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/[0.02]">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-light via-white to-emerald-50/80">
          {cover ? (
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-300">
              <ImageIcon className="h-10 w-10" />
              <span className="text-xs font-medium">Add a cover image</span>
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-primary shadow-sm backdrop-blur">
              {category}
            </span>
            {form.status ? (
              <span
                className={clsx(
                  'rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize shadow-sm backdrop-blur',
                  STATUS_STYLES[form.status] || STATUS_STYLES.draft,
                )}
              >
                {form.status}
              </span>
            ) : null}
          </div>
          {form.images?.length > 1 ? (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
              +{form.images.length - 1} more
            </div>
          ) : null}
        </div>

        <div className="space-y-3 px-4 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {form.sku || 'sku-pending'}
            </p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-gray-900">
              {form.name || 'Product name'}
            </h3>
            {form.tagline ? (
              <p className="mt-1 text-sm text-brand-primary/90">{form.tagline}</p>
            ) : (
              <p className="mt-1 text-sm italic text-gray-300">Tagline appears here</p>
            )}
          </div>

          <div className="flex items-end justify-between gap-3 rounded-xl bg-gray-50 px-3 py-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Price
              </p>
              <p className="mt-0.5 text-xl font-bold text-gray-900">{price}</p>
            </div>
            <p className="text-right text-xs text-gray-500">{unit}</p>
          </div>

          <p
            className={clsx(
              'rounded-lg px-3 py-2 text-xs font-medium',
              form.unlimitedStock || (form.stockQuantity && Number(form.stockQuantity) > 0)
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600',
            )}
          >
            {stockLabel}
          </p>

          {form.description ? (
            <p className="text-xs leading-relaxed text-gray-500 line-clamp-3">
              {form.description}
            </p>
          ) : null}

          {form.applicationMethod ? (
            <div className="rounded-xl border border-dashed border-brand-primary/20 bg-brand-light/40 px-3 py-2.5">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-primary">
                <Leaf className="h-3 w-3" />
                How to apply
              </div>
              <p className="text-xs leading-relaxed text-gray-600 line-clamp-3">
                {form.applicationMethod}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Add to cart
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Active products with images appear in the BioDrops farmer shop catalog.
      </p>
    </div>
  )
}
