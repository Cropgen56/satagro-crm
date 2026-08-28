import SubscriptionPlanFeatureSummary from '@/components/subscriptions/SubscriptionPlanFeatureSummary'
import { formatPricePerAcre } from '@/lib/subscriptionPlans'
import clsx from 'clsx'
import { Smartphone } from 'lucide-react'

export default function SubscriptionPlanPreview({ form }) {
  const previewPlan = {
    name: form.name || 'Plan name',
    description: form.description,
    pricing: [
      {
        currency: 'INR',
        billingCycle: 'monthly',
        pricePerUnitMinor: Math.round(Number(form.monthlyPrice || 0) * 100),
      },
      {
        currency: 'INR',
        billingCycle: 'yearly',
        pricePerUnitMinor: Math.round(Number(form.yearlyPrice || 0) * 100),
      },
    ],
    isTrialEnabled: form.isTrialEnabled,
    trialDays: Number(form.trialDays) || 0,
    features: form.features,
    active: form.active,
    isInternal: form.isInternal,
  }

  return (
    <div className="sticky top-6 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <Smartphone className="h-3.5 w-3.5" />
        Farmer app preview
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-[#E7EFEC]/40 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-gray-900">{previewPlan.name}</p>
            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              Up to {form.maxAcres || '—'} acre
            </span>
          </div>
          {previewPlan.description ? (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {previewPlan.description}
            </p>
          ) : null}
        </div>

        <div className="space-y-3 px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Monthly
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {formatPricePerAcre(previewPlan, 'monthly')}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Yearly
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {formatPricePerAcre(previewPlan, 'yearly')}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Flat package price</p>

          {previewPlan.isTrialEnabled ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              {previewPlan.trialDays}-day free trial included
            </p>
          ) : null}

          <div className="flex flex-wrap gap-1.5">
            <span
              className={clsx(
                'rounded-full px-2 py-0.5 text-[10px] font-medium',
                previewPlan.active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-500',
              )}
            >
              {previewPlan.active ? 'Active' : 'Inactive'}
            </span>
            {previewPlan.isInternal ? (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                Internal only
              </span>
            ) : null}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="mb-2 text-xs font-semibold text-gray-500">Included features</p>
            <SubscriptionPlanFeatureSummary
              features={form.features}
              compact
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Farmers see active, non-internal mobile plans when unlocking a field.
      </p>
    </div>
  )
}
