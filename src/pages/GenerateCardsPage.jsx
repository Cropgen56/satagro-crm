import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import ProductAccessCard from '@/components/subscriptions/ProductAccessCard'
import GeneratedCardsPanel from '@/components/subscriptions/GeneratedCardsPanel'
import { cacheGeneratedCardCodes, generateAccessCards } from '@/lib/accessCards'
import { fetchSubscriptionPlans, isTierPlan } from '@/lib/subscriptionPlans'
import { DEFAULT_PRODUCT_NAME } from '@/lib/productCardConfig'
import { ArrowLeft } from 'lucide-react'

const SAMPLE_CODE = 'BD-SAMPLE-CODE'

export default function GenerateCardsPage() {
  const [form, setForm] = useState({
    label: '',
    productName: DEFAULT_PRODUCT_NAME,
    planId: '',
    durationMonths: '12',
    quantity: '10',
    redeemBy: '',
    notes: '',
  })
  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  // Cards only make sense for acre-package plans — a card redeems directly
  // into the plan that matches its acre cap, so per-acre legacy plans (no
  // maxAcres) aren't offered here.
  const packagePlans = useMemo(
    () => plans.filter((p) => p.active !== false && isTierPlan(p)),
    [plans],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setPlansLoading(true)
        const res = await fetchSubscriptionPlans()
        if (cancelled) return
        setPlans(res?.data || [])
      } catch (err) {
        if (!cancelled) setPlansError(err.message || 'Failed to load plans')
      } finally {
        if (!cancelled) setPlansLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!form.planId && packagePlans.length) {
      update('planId', packagePlans[0]._id)
    }
  }, [packagePlans, form.planId])

  const selectedPlan = packagePlans.find((p) => p._id === form.planId) || null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!form.planId) {
      setError('Select an acre-package plan for these cards')
      return
    }

    setLoading(true)
    try {
      const res = await generateAccessCards({
        label: form.label.trim(),
        productName: form.productName.trim() || undefined,
        planId: form.planId,
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

          <div>
            <label className="text-xs font-medium text-gray-500">
              Subscription plan *
            </label>
            {plansLoading ? (
              <div className="mt-1 h-9 w-full animate-pulse rounded-lg bg-gray-100" />
            ) : packagePlans.length === 0 ? (
              <p className="mt-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                No active acre-package plans yet.{' '}
                <Link to="/subscriptions/plans/new" className="font-semibold underline">
                  Create one first
                </Link>
                , then come back to generate cards for it.
              </p>
            ) : (
              <select
                required
                value={form.planId}
                onChange={(e) => update('planId', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {packagePlans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} — up to {plan.maxAcres} acre
                  </option>
                ))}
              </select>
            )}
            {plansError ? (
              <p className="mt-1 text-[11px] text-red-600">{plansError}</p>
            ) : (
              <p className="mt-1 text-[11px] text-gray-400">
                Redeeming a card activates this exact plan for the farmer,
                free, for the selected duration — the acre cap always matches
                the plan, never typed separately.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="text-xs font-medium text-gray-500">Duration *</label>
              <select
                value={form.durationMonths}
                onChange={(e) => update('durationMonths', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m} {m === 1 ? 'month' : 'months'}
                  </option>
                ))}
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
            disabled={loading || plansLoading || !packagePlans.length}
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
            acreLimit={Number(selectedPlan?.maxAcres) || 5}
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
