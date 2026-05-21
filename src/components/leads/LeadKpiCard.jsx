import clsx from 'clsx'
import { Calendar, CheckCircle2, Sparkles, UserPlus, Users, XCircle } from 'lucide-react'

const icons = {
  users: Users,
  sparkles: Sparkles,
  calendar: Calendar,
  check: CheckCircle2,
  x: XCircle,
}

export default function LeadKpiCard({ label, value, icon, color }) {
  const Icon = icons[icon] || Users
  const [bg, text] = color.split(' ')

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', bg)}>
          <Icon className={clsx('h-5 w-5', text)} strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
          <p className="mt-0.5 text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
