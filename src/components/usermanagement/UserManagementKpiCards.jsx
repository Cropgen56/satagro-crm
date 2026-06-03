import { Users, CheckCircle2, Clock3, Ban } from 'lucide-react'

const cards = [
  {
    key: 'totalUsers',
    label: 'Total',
    icon: Users,
    iconClass: 'text-brand-primary',
    bgClass: 'bg-[#E7EFEC]',
  },
  {
    key: 'active',
    label: 'Active',
    icon: CheckCircle2,
    iconClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
  },
  {
    key: 'onboarding',
    label: 'Onboarding',
    icon: Clock3,
    iconClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    compute: (s) => (s?.pending ?? 0) + (s?.awaitingLogin ?? 0),
  },
  {
    key: 'disabled',
    label: 'Suspended',
    icon: Ban,
    iconClass: 'text-red-700',
    bgClass: 'bg-red-50',
  },
]

export default function UserManagementKpiCards({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, iconClass, bgClass, compute }) => {
        const value = compute ? compute(stats) : (stats?.[key] ?? 0)
        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bgClass}`}
            >
              <Icon className={`h-5 w-5 ${iconClass}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
