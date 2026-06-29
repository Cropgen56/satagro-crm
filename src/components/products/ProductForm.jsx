import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UNITS = [
  { value: 'per_unit', label: 'Per unit' },
  { value: 'per_liter', label: 'Per liter' },
  { value: 'per_kg', label: 'Per kg' },
  { value: 'per_acre', label: 'Per acre' },
]

const CATEGORIES = [
  { value: 'biofertilizer', label: 'Biofertilizer' },
  { value: 'compost', label: 'Compost' },
  { value: 'fungicide', label: 'Fungicide' },
  { value: 'disease_control', label: 'Disease control' },
  { value: 'other', label: 'Other' },
]

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]

const emptyForm = {
  sku: '',
  name: '',
  description: '',
  tagline: '',
  imageUrl: '',
  price: '',
  unit: 'per_unit',
  category: 'other',
  stockQuantity: '',
  status: 'draft',
  applicationMethod: '',
  sortOrder: 0,
}

export function productToForm(product) {
  if (!product) return { ...emptyForm }
  return {
    sku: product.sku || '',
    name: product.name || '',
    description: product.description || '',
    tagline: product.tagline || '',
    imageUrl: product.images?.[0]?.url || '',
    price: product.priceMinor != null ? String(product.priceMinor / 100) : '',
    unit: product.unit || 'per_unit',
    category: product.category || 'other',
    stockQuantity:
      product.stockQuantity == null ? '' : String(product.stockQuantity),
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
    images: form.imageUrl.trim()
      ? [{ url: form.imageUrl.trim(), alt: form.name.trim() }]
      : [],
    priceMinor: Math.round((Number.isFinite(priceRupees) ? priceRupees : 0) * 100),
    unit: form.unit,
    category: form.category,
    stockQuantity: form.stockQuantity === '' ? null : Number(form.stockQuantity),
    status: form.status,
    applicationMethod: form.applicationMethod.trim(),
    sortOrder: Number(form.sortOrder) || 0,
  }
}

export default function ProductForm({ initial, onSubmit, submitting = false, error = '' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(() => productToForm(initial))

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formToPayload(form))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">SKU</label>
          <input
            required
            value={form.sku}
            onChange={(e) => update('sku', e.target.value)}
            disabled={Boolean(initial?.id)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary disabled:bg-gray-50"
            placeholder="azospirillum"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Product name</label>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => update('tagline', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Price (INR)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Unit</label>
          <select
            value={form.unit}
            onChange={(e) => update('unit', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Stock quantity</label>
          <input
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) => update('stockQuantity', e.target.value)}
            placeholder="Leave empty for unlimited"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sort order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => update('sortOrder', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
          <input
            value={form.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Application method</label>
          <textarea
            rows={2}
            value={form.applicationMethod}
            onChange={(e) => update('applicationMethod', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : initial?.id ? 'Save changes' : 'Create product'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
