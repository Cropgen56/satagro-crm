import {
  PLAN_FEATURE_KEYS,
  PLAN_FEATURE_LABELS,
} from '@/lib/subscriptionPlans'
import clsx from 'clsx'

export default function SubscriptionPlanFeatureToggles({
  features,
  onChange,
  disabled = false,
}) {
  const toggle = (key) => {
    onChange({
      ...features,
      [key]: !features?.[key],
    })
  }

  const setAll = (value) => {
    const next = {}
    for (const key of PLAN_FEATURE_KEYS) {
      next[key] = value
    }
    onChange(next)
  }

  const enabledCount = PLAN_FEATURE_KEYS.filter((key) => features?.[key]).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {enabledCount} of {PLAN_FEATURE_KEYS.length} features enabled
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setAll(true)}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Enable all
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setAll(false)}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {PLAN_FEATURE_KEYS.map((key) => {
          const checked = Boolean(features?.[key])
          return (
            <label
              key={key}
              className={clsx(
                'flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition',
                checked
                  ? 'border-brand-primary/25 bg-[#E7EFEC]/60'
                  : 'border-gray-100 bg-gray-50/50 hover:border-gray-200',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(key)}
                className="mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/30"
              />
              <span className="text-sm text-gray-800">
                {PLAN_FEATURE_LABELS[key]}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
