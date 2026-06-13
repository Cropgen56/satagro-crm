import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import ProductAccessCard from '@/components/subscriptions/ProductAccessCard'
import GeneratedCardsPanel from '@/components/subscriptions/GeneratedCardsPanel'
import { cacheGeneratedCardCodes, generateAccessCards } from '@/lib/accessCards'
import { DEFAULT_PRODUCT_NAME } from '@/lib/productCardConfig'
import { ArrowLeft } from 'lucide-react'

const SAMPLE_CODE = 'BD-SAMPLE-CODE'

export default function GenerateCardsPage() {
  const [form, setForm] = useState({
    label: '',
    productName: DEFAULT_PRODUCT_NAME,
    acreLimit: '5',
    durationMonths: '12',
    quantity: '10',
    redeemBy: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await generateAccessCards({
        label: form.label.trim(),
        productName: form.productName.trim() || undefined,
        acreLimit: Number(form.acreLimit),
        durationMonths: Number(form.durationMonths),
        quantity: Number(form.quantity),
        redeemBy: form.redeemBy || undefined,
        notes: form.notes.trim() || undefined,
      })
      cacheGeneratedCardCodes(res?.codes, res?.batchId)
      setResult(res)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <Link
        to="/subscriptions/cards"
        className="no-print mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cards
      </Link>

      <PageTopBar />

      <header className="no-print mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary">
          Generate product cards
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create printable A5 cards with unique QR codes for BioDrops Bokashi kits
        </p>
      </header>

      {result?.codes?.length ? (
        <GeneratedCardsPanel
          result={result}
          productName={form.productName.trim() || DEFAULT_PRODUCT_NAME}
        />
      ) : null}

      <div className="no-print mt-8 grid gap-8 xl:grid-cols-[minmax(0,420px)_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-xs font-medium text-gray-500">Batch label *</label>
            <input
              required
              value={form.label}
              onChange={(e) => update('label', e.target.value)}
              placeholder="e.g. Maharashtra Q2 2026"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">
              Product name (card header)
            </label>
            <input
              value={form.productName}
              onChange={(e) => update('productName', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Quantity *</label>
              <input
                required
                type="number"
                min="1"
                max="10000"
                value={form.quantity}
                onChange={(e) => update('quantity', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Acre limit *</label>
              <input
                required
                type="number"
                min="0.1"
                step="0.1"
                value={form.acreLimit}
                onChange={(e) => update('acreLimit', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Duration *</label>
              <select
                value={form.durationMonths}
                onChange={(e) => update('durationMonths', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">
              Card expiry date (optional)
            </label>
            <input
              type="date"
              value={form.redeemBy}
              onChange={(e) => update('redeemBy', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              After this date the card cannot be scanned or redeemed. Leave empty
              for no expiry.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#3d7a14] py-2.5 text-sm font-semibold text-white hover:bg-[#2d5010] disabled:opacity-60"
          >
            {loading ? 'Generating…' : 'Generate cards with QR codes'}
          </button>
        </form>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Live card preview</h2>
            <p className="mt-1 text-xs text-gray-500">
              A5 landscape layout — product photo, benefits, and QR linked to each
              unlock code
            </p>
          </div>
          <ProductAccessCard
            code={SAMPLE_CODE}
            productName={form.productName.trim() || DEFAULT_PRODUCT_NAME}
            acreLimit={Number(form.acreLimit) || 5}
            durationMonths={Number(form.durationMonths) || 12}
          />
          <p className="text-center text-[10px] text-gray-400">
            Sample QR — real codes are generated uniquely per card after batch
            creation
          </p>
        </div>
      </div>
    </div>
  )
}
