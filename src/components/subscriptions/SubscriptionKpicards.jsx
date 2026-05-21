import clsx from 'clsx'
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Wallet,
  XCircle,
} from 'lucide-react'

const icons = {
  'check-circle': CheckCircle2,
  'alert-triangle': AlertTriangle,
  'x-circle': XCircle,
  wallet: Wallet,
  'refresh-cw': RefreshCw,
  badge: BadgeCheck,
  clock: Clock3,
}

export default function SubscriptionKpiCard({
  label,
  value,
  icon,
  color,
  trend,
}) {
  const Icon = icons[icon] || CheckCircle2

  const [bg, text] = color.split(' ')

  return (
   <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
  <div className="flex items-start justify-between">
    <div
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-lg',
        bg
      )}
    >
      <Icon className={clsx('h-5 w-5', text)} strokeWidth={1.75} />
    </div>

    {trend && (
      <div
        className={clsx(
          'rounded-full px-2 py-1 text-[10px] font-semibold',
          bg,
          text
        )}
      >
        {trend}
      </div>
    )}
  </div>

  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
    {label}
  </p>

  <p className="mt-1 text-2xl font-bold text-gray-900">
    {value}
  </p>
</div>
  )
}