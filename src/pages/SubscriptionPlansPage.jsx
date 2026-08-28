import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import SubscriptionPlanFeatureSummary, {
  SubscriptionPlanFeatureCount,
} from '@/components/subscriptions/SubscriptionPlanFeatureSummary'
import {
  deleteSubscriptionPlan,
  fetchSubscriptionPlans,
  formatPricePerAcre,
  isTierPlan,
  PLAN_FEATURE_KEYS,
} from '@/lib/subscriptionPlans'
import {
  ArrowLeft,
  Calendar,
  Layers,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
} from 'lucide-react'
import clsx from 'clsx'

const PLATFORM_FILTERS = [
  { value: '', label: 'All platforms' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'web', label: 'Web' },
]

function PlanStatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  )
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [platformFilter, setPlatformFilter] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetchSubscriptionPlans(platformFilter)
      setPlans(res?.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load plans')
      setPlans([])
    } finally {
      setLoading(false)
    }
  }, [platformFilter])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const active = plans.filter((p) => p.active).length
    const withTrial = plans.filter((p) => p.isTrialEnabled).length
    const publicPlans = plans.filter((p) => !p.isInternal).length
    return { total: plans.length, active, withTrial, publicPlans }
  }, [plans])

  const handleDelete = async (plan) => {
    if (
      !window.confirm(
        `Delete plan "${plan.name}"? Farmers will no longer see it in the app.`,
      )
    ) {
      return
    }

    try {
      setDeletingId(plan._id)
      await deleteSubscriptionPlan(plan._id)
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <Link
        to="/subscriptions"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to subscriptions
      </Link>

      <PageTopBar />

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[28px]">
            Subscription plans
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Create and manage BioDrops per-acre plans — pricing, trials, and
            feature flags shown when farmers unlock a field
          </p>
        </div>

        <Link
          to="/subscriptions/plans/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
        >
          <Plus className="h-4 w-4" />
          Create plan
        </Link>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PlanStatCard label="Total plans" value={stats.total} />
        <PlanStatCard
          label="Active"
          value={stats.active}
          hint="Visible when active + not internal"
        />
        <PlanStatCard label="With trial" value={stats.withTrial} />
        <PlanStatCard label="Public" value={stats.publicPlans} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {PLATFORM_FILTERS.map((item) => (
            <button
              key={item.value || 'all'}
              type="button"
              onClick={() => setPlatformFilter(item.value)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                platformFilter === item.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white"
            />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="mt-8 space-y-4">
          <EmptyState
            icon={Layers}
            title="No plans yet"
            description="Create a BioDrops subscription plan with per-acre pricing and feature flags for the farmer app."
          />
          <div className="text-center">
            <Link
              to="/subscriptions/plans/new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950"
            >
              <Plus className="h-4 w-4" />
              Create plan
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:border-brand-primary/20 hover:shadow-md"
            >
              <div className="border-b border-gray-100 bg-[#FAFAFA] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-900">
                      {plan.name}
                    </h2>
                    <p className="mt-0.5 truncate font-mono text-xs text-gray-400">
                      {plan.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    <span
                      className={clsx(
                        'rounded-full px-2 py-0.5 text-[10px] font-medium',
                        plan.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500',
                      )}
                    >
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                    {plan.isInternal ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        Internal
                      </span>
                    ) : null}
                    {isTierPlan(plan) ? (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                        Up to {plan.maxAcres} acre
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 px-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      {isTierPlan(plan) ? 'Monthly package' : 'Monthly / acre'}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatPricePerAcre(plan, 'monthly')}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      {isTierPlan(plan) ? 'Yearly package' : 'Yearly / acre'}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatPricePerAcre(plan, 'yearly')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 capitalize">
                    <Smartphone className="h-3 w-3" />
                    {plan.platform}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1">
                    <Calendar className="h-3 w-3" />
                    {plan.isTrialEnabled
                      ? `${plan.trialDays || 0}-day trial`
                      : 'No trial'}
                  </span>
                  <SubscriptionPlanFeatureCount features={plan.features} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Features
                  </p>
                  <SubscriptionPlanFeatureSummary
                    features={plan.features}
                    compact
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                <p className="text-xs text-gray-400">
                  {PLAN_FEATURE_KEYS.filter((k) => plan.features?.[k]).length} of{' '}
                  {PLAN_FEATURE_KEYS.length} enabled
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/subscriptions/plans/${plan._id}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === plan._id}
                    onClick={() => handleDelete(plan)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
