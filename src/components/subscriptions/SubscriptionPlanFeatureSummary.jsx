import {
  PLAN_FEATURE_KEYS,
  PLAN_FEATURE_LABELS,
  summarizePlanFeatures,
} from '@/lib/subscriptionPlans'
import clsx from 'clsx'
import { Check, X } from 'lucide-react'

export function SubscriptionPlanFeatureCount({ features, className }) {
  const count = PLAN_FEATURE_KEYS.filter((key) => features?.[key]).length
  const total = PLAN_FEATURE_KEYS.length

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        count > 0
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-gray-100 text-gray-500',
        className,
      )}
    >
      {count}/{total} features
    </span>
  )
}

export default function SubscriptionPlanFeatureSummary({
  features,
  compact = false,
  className,
}) {
  const { count, labels, remainder } = summarizePlanFeatures(features)

  if (count === 0) {
    return (
      <p className={clsx('text-xs text-gray-400', className)}>
        No features enabled
      </p>
    )
  }

  if (compact) {
    return (
      <div className={clsx('flex flex-wrap gap-1.5', className)}>
        {labels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600"
          >
            <Check className="h-3 w-3 text-emerald-600" />
            {label}
          </span>
        ))}
        {remainder > 0 ? (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            +{remainder} more
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <ul className={clsx('space-y-1.5', className)}>
      {PLAN_FEATURE_KEYS.map((key) => {
        const enabled = Boolean(features?.[key])
        return (
          <li
            key={key}
            className={clsx(
              'flex items-start gap-2 text-xs',
              enabled ? 'text-gray-700' : 'text-gray-400',
            )}
          >
            {enabled ? (
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            ) : (
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
            )}
            <span>{PLAN_FEATURE_LABELS[key]}</span>
          </li>
        )
      })}
    </ul>
  )
}
