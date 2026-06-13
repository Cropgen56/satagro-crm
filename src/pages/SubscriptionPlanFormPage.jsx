import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormSection from '@/components/add-farmer/FormSection'
import PageTopBar from '@/components/layout/PageTopBar'
import SubscriptionPlanFeatureToggles from '@/components/subscriptions/SubscriptionPlanFeatureToggles'
import SubscriptionPlanPreview from '@/components/subscriptions/SubscriptionPlanPreview'
import {
  buildPlanPayload,
  createSubscriptionPlan,
  fetchSubscriptionPlanById,
  getDefaultPlanFeatures,
  slugifyPlanName,
  updateSubscriptionPlan,
} from '@/lib/subscriptionPlans'
import {
  ArrowLeft,
  IndianRupee,
  Layers,
  Settings2,
  Sparkles,
  Tag,
} from 'lucide-react'
import clsx from 'clsx'

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  platform: 'mobile',
  monthlyPricePerAcre: '50',
  yearlyPricePerAcre: '500',
  isTrialEnabled: true,
  trialDays: '15',
  active: true,
  isInternal: false,
  features: getDefaultPlanFeatures(),
}

function planToForm(plan) {
  const monthly = (plan?.pricing || []).find(
    (p) => p.billingCycle === 'monthly' && p.currency === 'INR',
  )
  const yearly = (plan?.pricing || []).find(
    (p) => p.billingCycle === 'yearly' && p.currency === 'INR',
  )

  return {
    name: plan?.name || '',
    slug: plan?.slug || '',
    description: plan?.description || '',
    platform: plan?.platform || 'mobile',
    monthlyPricePerAcre: monthly
      ? String(Number(monthly.pricePerUnitMinor) / 100)
      : '50',
    yearlyPricePerAcre: yearly
      ? String(Number(yearly.pricePerUnitMinor) / 100)
      : '500',
    isTrialEnabled: plan?.isTrialEnabled !== false,
    trialDays: String(plan?.trialDays ?? 15),
    active: plan?.active !== false,
    isInternal: Boolean(plan?.isInternal),
    features: {
      ...getDefaultPlanFeatures(),
      ...(plan?.features || {}),
    },
  }
}

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-primary/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/10'

export default function SubscriptionPlanFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return

    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetchSubscriptionPlanById(id)
        if (!cancelled) {
          setForm(planToForm(res?.data))
          setSlugTouched(true)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load plan')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const update = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && !slugTouched) {
        next.slug = slugifyPlanName(value)
      }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Plan name is required')
      return
    }
    if (!form.slug.trim()) {
      setError('Slug is required')
      return
    }
    if (
      Number(form.monthlyPricePerAcre) < 0 ||
      Number(form.yearlyPricePerAcre) < 0
    ) {
      setError('Prices cannot be negative')
      return
    }

    const payload = buildPlanPayload(form)

    try {
      setSaving(true)
      if (isEdit) {
        await updateSubscriptionPlan(id, payload)
      } else {
        await createSubscriptionPlan(payload)
      }
      navigate('/subscriptions/plans')
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-8 h-96 max-w-4xl animate-pulse rounded-2xl bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <Link
        to="/subscriptions/plans"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to plans
      </Link>

      <PageTopBar />

      <header className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[28px]">
          {isEdit ? 'Edit subscription plan' : 'Create subscription plan'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure per-acre pricing, trial settings, and feature flags for the
          BioDrops mobile app
        </p>
      </header>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <FormSection icon={Tag} title="Plan details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Plan name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                  placeholder="Satagro Standard"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    update('slug', e.target.value)
                  }}
                  className={clsx(inputClass, 'font-mono')}
                  placeholder="biodrops-mobile-standard"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Unique identifier used by the API and Razorpay checkout
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                  className={inputClass}
                  placeholder="Per-acre advisory and field monitoring"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Platform
                </label>
                <select
                  value={form.platform}
                  onChange={(e) => update('platform', e.target.value)}
                  className={inputClass}
                >
                  <option value="mobile">Mobile (BioDrops app)</option>
                  <option value="web">Web</option>
                </select>
              </div>
            </div>
          </FormSection>

          <FormSection icon={IndianRupee} title="Per-acre pricing (INR)">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Monthly price per acre
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.monthlyPricePerAcre}
                    onChange={(e) =>
                      update('monthlyPricePerAcre', e.target.value)
                    }
                    className={clsx(inputClass, 'pl-7')}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Yearly price per acre
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.yearlyPricePerAcre}
                    onChange={(e) =>
                      update('yearlyPricePerAcre', e.target.value)
                    }
                    className={clsx(inputClass, 'pl-7')}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Checkout amount = field acres × selected per-acre rate
            </p>
          </FormSection>

          <FormSection icon={Sparkles} title="Trial & visibility">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Trial days
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.trialDays}
                  disabled={!form.isTrialEnabled}
                  onChange={(e) => update('trialDays', e.target.value)}
                  className={clsx(
                    inputClass,
                    !form.isTrialEnabled && 'bg-gray-50',
                  )}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isTrialEnabled}
                  onChange={(e) => update('isTrialEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-brand-primary"
                />
                Enable free trial
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => update('active', e.target.checked)}
                  className="rounded border-gray-300 text-brand-primary"
                />
                Active (visible in app)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isInternal}
                  onChange={(e) => update('isInternal', e.target.checked)}
                  className="rounded border-gray-300 text-brand-primary"
                />
                Internal only (hidden from farmers)
              </label>
            </div>
          </FormSection>

          <FormSection icon={Layers} title="Feature flags">
            <p className="text-sm text-gray-500">
              Toggle capabilities included in this plan. Farmers see these in
              the plan picker when unlocking a field.
            </p>
            <SubscriptionPlanFeatureToggles
              features={form.features}
              onChange={(features) => update('features', features)}
            />
          </FormSection>

          <div className="flex gap-3 border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create plan'}
            </button>
            <Link
              to="/subscriptions/plans"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>

        <aside className="hidden xl:block">
          <SubscriptionPlanPreview form={form} />
        </aside>
      </div>

      <div className="mt-6 xl:hidden">
        <FormSection icon={Settings2} title="Farmer app preview">
          <SubscriptionPlanPreview form={form} />
        </FormSection>
      </div>
    </div>
  )
}
