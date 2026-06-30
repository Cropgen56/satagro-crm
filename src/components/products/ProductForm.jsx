import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import {
  Archive,
  Boxes,
  Check,
  ImagePlus,
  IndianRupee,
  Loader2,
  Package,
  Sparkles,
  Star,
  Tag,
  Upload,
  X,
} from 'lucide-react'
import FormSection from '@/components/add-farmer/FormSection'
import { uploadProductImage } from '@/lib/productUpload'

const UNITS = [
  { value: 'per_unit', label: 'Per unit' },
  { value: 'per_liter', label: 'Per liter' },
  { value: 'per_kg', label: 'Per kg' },
  { value: 'per_acre', label: 'Per acre' },
]

const CATEGORIES = [
  { value: 'biofertilizer', label: 'Biofertilizer', accent: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  { value: 'compost', label: 'Compost', accent: 'bg-amber-50 text-amber-800 ring-amber-200' },
  { value: 'fungicide', label: 'Fungicide', accent: 'bg-violet-50 text-violet-700 ring-violet-200' },
  { value: 'disease_control', label: 'Disease control', accent: 'bg-sky-50 text-sky-700 ring-sky-200' },
  { value: 'other', label: 'Other', accent: 'bg-gray-50 text-gray-700 ring-gray-200' },
]

const STATUSES = [
  {
    value: 'draft',
    label: 'Draft',
    hint: 'Save without publishing to the shop',
    icon: Package,
    ring: 'ring-gray-300',
    active: 'border-gray-900 bg-gray-50',
  },
  {
    value: 'active',
    label: 'Active',
    hint: 'Visible and purchasable in farmer shop',
    icon: Sparkles,
    ring: 'ring-emerald-400',
    active: 'border-emerald-600 bg-emerald-50/60',
  },
  {
    value: 'archived',
    label: 'Archived',
    hint: 'Hidden from catalog, kept for records',
    icon: Archive,
    ring: 'ring-amber-400',
    active: 'border-amber-600 bg-amber-50/60',
  },
]

const emptyForm = {
  sku: '',
  name: '',
  description: '',
  tagline: '',
  images: [],
  price: '',
  unit: 'per_unit',
  category: 'other',
  stockQuantity: '',
  lowStockThreshold: '',
  unlimitedStock: true,
  status: 'draft',
  applicationMethod: '',
  sortOrder: 0,
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm transition focus:border-brand-primary/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/10'

function slugifySku(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function productToForm(product) {
  if (!product) return { ...emptyForm }
  return {
    sku: product.sku || '',
    name: product.name || '',
    description: product.description || '',
    tagline: product.tagline || '',
    images: product.images || [],
    price: product.priceMinor != null ? String(product.priceMinor / 100) : '',
    unit: product.unit || 'per_unit',
    category: product.category || 'other',
    stockQuantity:
      product.stockQuantity == null ? '' : String(product.stockQuantity),
    lowStockThreshold:
      product.lowStockThreshold == null ? '' : String(product.lowStockThreshold),
    unlimitedStock: product.stockQuantity == null,
    status: product.status || 'draft',
    applicationMethod: product.applicationMethod || '',
    sortOrder: product.sortOrder ?? 0,
  }
}

export function formToPayload(form) {
  const priceRupees = parseFloat(form.price)
  return {
    sku: form.sku.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
    tagline: form.tagline.trim(),
    images: (form.images || []).map((img, idx) => ({
      url: img.url,
      alt: img.alt || form.name.trim() || `Image ${idx + 1}`,
    })),
    priceMinor: Math.round((Number.isFinite(priceRupees) ? priceRupees : 0) * 100),
    unit: form.unit,
    category: form.category,
    stockQuantity: form.unlimitedStock
      ? null
      : form.stockQuantity === ''
        ? 0
        : Number(form.stockQuantity),
    lowStockThreshold:
      form.lowStockThreshold === '' ? null : Number(form.lowStockThreshold),
    status: form.status,
    applicationMethod: form.applicationMethod.trim(),
    sortOrder: Number(form.sortOrder) || 0,
  }
}

export default function ProductForm({
  initial,
  onSubmit,
  onFormChange,
  submitting = false,
  error = '',
  isEdit = false,
}) {
  const [form, setForm] = useState(() => productToForm(initial))
  const [skuTouched, setSkuTouched] = useState(Boolean(initial?.id))
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    onFormChange?.(form)
  }, [form, onFormChange])

  const update = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && !skuTouched && !initial?.id) {
        next.sku = slugifySku(value)
      }
      return next
    })
  }

  const uploadFiles = async (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    if (!list.length) return

    try {
      setUploading(true)
      setUploadError('')
      const uploaded = []
      for (const file of list) {
        const url = await uploadProductImage(file)
        uploaded.push({ url, alt: form.name || file.name })
      }
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploaded],
      }))
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e) => {
    await uploadFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    await uploadFiles(e.dataTransfer.files)
  }

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const setCoverImage = (index) => {
    if (index === 0) return
    setForm((prev) => {
      const images = [...(prev.images || [])]
      const [picked] = images.splice(index, 1)
      images.unshift(picked)
      return { ...prev, images }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formToPayload(form))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {(error || uploadError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || uploadError}
        </div>
      )}

      <FormSection icon={Tag} title="Product identity">
        <p className="text-sm text-gray-500">
          Core details shown on the product card in the farmer shop.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputClass}
              placeholder="Azospirillum Biofertilizer"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              required
              value={form.sku}
              onChange={(e) => {
                setSkuTouched(true)
                update('sku', e.target.value)
              }}
              disabled={Boolean(initial?.id)}
              className={clsx(inputClass, 'font-mono', initial?.id && 'bg-gray-50')}
              placeholder="azospirillum-500ml"
            />
            {!initial?.id ? (
              <p className="mt-1 text-xs text-gray-400">
                Auto-generated from name — edit if needed
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Sort order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => update('sortOrder', e.target.value)}
              className={inputClass}
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-400">Lower numbers appear first</p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input
              value={form.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              className={inputClass}
              placeholder="Nitrogen-fixing bacteria for healthier crops"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className={inputClass}
              placeholder="Describe benefits, composition, and ideal crops..."
            />
          </div>
        </div>
      </FormSection>

      <FormSection icon={ImagePlus} title="Product media">
        <p className="text-sm text-gray-500">
          Upload high-quality images. The first image is used as the shop cover.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={clsx(
            'relative rounded-2xl border-2 border-dashed px-6 py-8 text-center transition',
            dragOver
              ? 'border-brand-primary bg-brand-light/50'
              : 'border-gray-200 bg-gradient-to-b from-gray-50/80 to-white hover:border-brand-primary/40',
          )}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </div>
          <p className="mt-3 text-sm font-medium text-gray-800">
            {uploading ? 'Uploading images…' : 'Drag & drop images here'}
          </p>
          <p className="mt-1 text-xs text-gray-400">PNG, JPG up to 5 MB each</p>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950">
            <ImagePlus className="h-4 w-4" />
            Browse files
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {(form.images || []).length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {form.images.map((img, idx) => (
              <div
                key={`${img.url}-${idx}`}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={img.url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                {idx === 0 ? (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                    <Star className="h-3 w-3 fill-current" />
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCoverImage(idx)}
                    className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-700 opacity-0 shadow backdrop-blur transition group-hover:opacity-100"
                  >
                    Set cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow opacity-0 transition group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </FormSection>

      <FormSection icon={IndianRupee} title="Pricing & category">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Price (INR)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                ₹
              </span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className={clsx(inputClass, 'pl-8')}
                placeholder="499"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              value={form.unit}
              onChange={(e) => update('unit', e.target.value)}
              className={inputClass}
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => update('category', cat.value)}
                  className={clsx(
                    'rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition',
                    form.category === cat.value
                      ? cat.accent
                      : 'bg-white text-gray-500 ring-gray-200 hover:bg-gray-50',
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection icon={Boxes} title="Inventory">
        <div className="grid gap-4 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => update('unlimitedStock', true)}
            className={clsx(
              'rounded-2xl border-2 p-4 text-left transition',
              form.unlimitedStock
                ? 'border-brand-primary bg-brand-light/40'
                : 'border-gray-200 bg-white hover:border-gray-300',
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Unlimited stock</p>
              {form.unlimitedStock ? (
                <Check className="h-5 w-5 text-brand-primary" />
              ) : null}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Digital or always-available products — no quantity tracking
            </p>
          </button>

          <button
            type="button"
            onClick={() => update('unlimitedStock', false)}
            className={clsx(
              'rounded-2xl border-2 p-4 text-left transition',
              !form.unlimitedStock
                ? 'border-brand-primary bg-brand-light/40'
                : 'border-gray-200 bg-white hover:border-gray-300',
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Tracked inventory</p>
              {!form.unlimitedStock ? (
                <Check className="h-5 w-5 text-brand-primary" />
              ) : null}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Decrement on purchase; restore on cancel/refund
            </p>
          </button>
        </div>

        {!form.unlimitedStock ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Stock quantity
              </label>
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) => update('stockQuantity', e.target.value)}
                className={inputClass}
                placeholder="100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Low stock alert at
              </label>
              <input
                type="number"
                min="0"
                value={form.lowStockThreshold}
                onChange={(e) => update('lowStockThreshold', e.target.value)}
                placeholder="10"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">
                CRM flags products below this threshold
              </p>
            </div>
          </div>
        ) : null}
      </FormSection>

      <FormSection icon={Sparkles} title="Publishing status">
        <div className="grid gap-3 sm:grid-cols-3">
          {STATUSES.map((status) => {
            const Icon = status.icon
            const selected = form.status === status.value
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => update('status', status.value)}
                className={clsx(
                  'rounded-2xl border-2 p-4 text-left transition',
                  selected ? status.active : 'border-gray-200 bg-white hover:border-gray-300',
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={clsx(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      selected ? 'bg-white' : 'bg-gray-50 text-gray-500',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-semibold text-gray-900">{status.label}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{status.hint}</p>
              </button>
            )
          })}
        </div>
      </FormSection>

      <FormSection icon={Package} title="Usage guide">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Application method
        </label>
        <textarea
          rows={3}
          value={form.applicationMethod}
          onChange={(e) => update('applicationMethod', e.target.value)}
          className={inputClass}
          placeholder="Mix 500 ml per acre with irrigation water. Apply during early vegetative stage..."
        />
        <p className="mt-1 text-xs text-gray-400">
          Shown to farmers on the product detail screen
        </p>
      </FormSection>

      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-950 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : isEdit ? (
            'Save changes'
          ) : (
            'Create product'
          )}
        </button>
        <Link
          to="/ecommerce/products"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
