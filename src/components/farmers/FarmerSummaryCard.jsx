import clsx from 'clsx'
import { ArrowUpRight } from 'lucide-react'

const noteStyles = {
  success: 'text-green-500',
  warning: 'text-orange-500',
  danger: 'text-red-500',
  neutral: 'text-gray-500',
}

export default function FarmerSummaryCard({
  label,
  value,
  note,
  noteVariant = 'success',
  showTrend = false,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={clsx('rounded-xl p-2.5', iconBg)}>
          <Icon className={clsx('h-5 w-5', iconColor)} strokeWidth={1.75} />
        </div>
        <span
          className={clsx(
            'flex items-center gap-0.5 text-xs font-medium',
            noteStyles[noteVariant],
          )}
        >
          {showTrend && <ArrowUpRight className="h-3.5 w-3.5" />}
          {note}
        </span>
      </div>
      <p className="mt-4 text-[28px] font-bold leading-none text-gray-900">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{label}</p>
    </div>
  )
}
