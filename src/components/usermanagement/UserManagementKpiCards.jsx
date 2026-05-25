import {
  Users,
  CheckCircle2,
  Clock3,
  Ban,
  Globe2,
  GitBranch,
} from 'lucide-react'

const cards = [
  {
    label: 'TOTAL USERS',
    value: '1,284',
    icon: Users,
    bg: 'bg-[#E7EFEC]',
    color: 'text-brand-primary',
  },
  {
    label: 'ACTIVE',
    value: '1,142',
    icon: CheckCircle2,
    bg: 'bg-[#DCFCE7]',
    color: 'text-[#16A34A]',
  },
  {
    label: 'PENDING',
    value: '94',
    icon: Clock3,
    bg: 'bg-[#FEF3C7]',
    color: 'text-[#D97706]',
  },
  {
    label: 'DISABLED',
    value: '48',
    icon: Ban,
    bg: 'bg-[#FCE7E7]',
    color: 'text-[#DC2626]',
  },
  {
    label: 'COUNTRY ADMINS',
    value: '12',
    icon: Globe2,
    bg: 'bg-[#DBEAFE]',
    color: 'text-[#2563EB]',
  },
  {
    label: 'DIST. OPERATORS',
    value: '312',
    icon: GitBranch,
    bg: 'bg-[#F3E8FF]',
    color: 'text-[#9333EA]',
  },
]

export default function UserManagementKpiCards() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.label}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}
            >
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>

            <p className="mt-4 text-[11px] font-semibold tracking-wide text-[#4B5563]">
              {card.label}
            </p>

            <h3 className="mt-1 text-2xl font-bold text-brand-primary">
              {card.value}
            </h3>
          </div>
        )
      })}
    </div>
  )
}