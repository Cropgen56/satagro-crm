// AdvisoryKpiCard.jsx

import clsx from 'clsx'
import {
  AlertTriangle,
  ClipboardList,
  Clock3,
  Megaphone,
  Send,
} from 'lucide-react'

const icons = {
  clipboard: ClipboardList,
  megaphone: Megaphone,
  send: Send,
  clock: Clock3,
  'alert-triangle': AlertTriangle,
}

export default function AdvisoryKpiCard({
  label,
  value,
  icon,
  color,
}) {
  const Icon = icons[icon]

  const [bg, text] = color.split(' ')

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            {label}
          </p>

          <h2 className="mt-1 text-[30px] font-bold leading-none text-[#0B1F1A]">
            {value}
          </h2>
        </div>

        <div
          className={clsx(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            bg
          )}
        >
          <Icon className={clsx('h-4.5 w-4.5', text)} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}