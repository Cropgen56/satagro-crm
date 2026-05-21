import clsx from 'clsx'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
} from 'lucide-react'

const icons = {
  clipboard: ClipboardList,
  clock: Clock,
  progress: Loader2,
  check: CheckCircle2,
  alert: AlertTriangle,
}

export default function TaskKpiCard({ label, value, icon, color }) {
  const Icon = icons[icon] || ClipboardList
  const [bg, text] = color.split(' ')

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={clsx('flex h-10 w-10 items-center justify-center rounded-lg', bg)}>
        <Icon className={clsx('h-5 w-5', text)} strokeWidth={1.75} />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
