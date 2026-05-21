import clsx from 'clsx'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

const accentStyles = {
  blue: {
    border: 'border-t-[#3b82f6]',
    icon: 'bg-blue-50 text-blue-500',
  },
  green: {
    border: 'border-t-[#22c55e]',
    icon: 'bg-green-50 text-green-500',
  },
  yellow: {
    border: 'border-t-[#eab308]',
    icon: 'bg-yellow-50 text-yellow-500',
  },
  purple: {
    border: 'border-t-[#a855f7]',
    icon: 'bg-purple-50 text-purple-500',
  },
  teal: {
    border: 'border-t-[#14b8a6]',
    icon: 'bg-teal-50 text-teal-500',
  },
  red: {
    border: 'border-t-[#ef4444]',
    icon: 'bg-red-50 text-red-500',
  },
}

export default function StatCard({
  label,
  value,
  change,
  trend = 'up',
  icon: Icon,
  accent,
}) {
  const styles = accentStyles[accent]

  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-100 bg-white px-4 pb-4 pt-0 shadow-sm border-t-[3px]',
        styles.border,
      )}
    >
      <div className="flex items-start justify-between pt-4">
        <div className={clsx('rounded-lg p-2', styles.icon)}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        {change && trend !== 'alert' && (
          <span
            className={clsx(
              'flex items-center gap-0.5 text-xs font-semibold',
              trend === 'up' ? 'text-green-500' : 'text-red-500',
            )}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {change}
          </span>
        )}
        {trend === 'alert' && change && (
          <span className="text-xs font-bold text-red-500">{change}</span>
        )}
      </div>
      <p className="mt-2 text-[26px] font-bold leading-none text-gray-900">{value}</p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
    </div>
  )
}
