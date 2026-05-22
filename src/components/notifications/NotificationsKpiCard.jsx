// NotificationsKpiCard.jsx

import clsx from 'clsx'
import {
  Mail,
  AlertTriangle,
  BadgeAlert,
  Cog,
  BrainCircuit,
} from 'lucide-react'

const icons = {
  mail: Mail,
  alert: AlertTriangle,
  badge: BadgeAlert,
  system: Cog,
  advisory: BrainCircuit,
}

export default function NotificationsKpiCard({
  label,
  value,
  icon,
  color,
}) {
  const Icon = icons[icon] || Mail

  const [bg, text] = color.split(' ')

  return (
    <div className="rounded-2xl border border-[#ECECEC] bg-[#F8F9F8] px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-4">
        
        <div
          className={clsx(
            'flex h-12 w-12 items-center justify-center rounded-2xl',
            bg
          )}
        >
          <Icon className={clsx('h-5 w-5', text)} strokeWidth={2} />
        </div>

        <div>
          <h3 className="text-[20px] font-bold leading-none text-[#1E1E1E]">
            {value}
          </h3>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#7A7A7A]">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}