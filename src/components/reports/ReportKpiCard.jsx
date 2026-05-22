// ReportKpiCard.jsx

import clsx from 'clsx'
import {
  Users,
  ShieldCheck,
  Wallet,
  RadioTower,
  ClipboardList,
  Gauge,
} from 'lucide-react'

const icons = {
  users: Users,
  shield: ShieldCheck,
  wallet: Wallet,
  signal: RadioTower,
  clipboard: ClipboardList,
  gauge: Gauge,
}

export default function ReportKpiCard({
  title,
  value,
  trend,
  icon,
  color,
}) {
  const Icon = icons[icon]

  const [bg, text] = color.split(' ')

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={clsx(
            'flex h-11 w-11 items-center justify-center rounded-2xl',
            bg
          )}
        >
          <Icon className={clsx('h-5 w-5', text)} />
        </div>
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-wide text-[#7B7B7B]">
        {title}
      </p>

      <h3 className="mt-1 text-[28px] font-bold text-[#111827]">
        {value}
      </h3>

      <p className="mt-1 text-[11px] font-semibold text-[#16A34A]">
        ↗ {trend}
      </p>
    </div>
  )
}