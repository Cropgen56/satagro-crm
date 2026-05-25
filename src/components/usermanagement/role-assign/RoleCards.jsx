import clsx from 'clsx'
import {
  ShieldCheck,
  Globe,
  Map,
  Building2,
  Tractor,
  Check,
} from 'lucide-react'

const roles = [
  {
    title: 'Super Admin',
    desc: 'Full access across all organizational levels.',
    level: 'LEVEL 1',
    icon: ShieldCheck,
  },
  {
    title: 'Country Admin',
    desc: 'Manage state entities and regional logistics.',
    level: 'LEVEL 2',
    icon: Globe,
  },
  {
    title: 'State Admin',
    desc: 'Oversee district operators and field agents.',
    level: 'LEVEL 3',
    icon: Map,
    active: true,
  },
  {
    title: 'District Operator',
    desc: 'Focused on ground-level reporting & ops.',
    level: 'LEVEL 4',
    icon: Building2,
  },
  {
    title: 'FPO / Agent',
    desc: 'Direct interaction with farmers and clusters.',
    level: 'LEVEL 5',
    icon: Tractor,
  },
]

export default function RoleCards() {
  return (
    <div>
      <h2 className="text-[16px] font-semibold text-[#202939]">
        Select User Role
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {roles.map((role) => {
          const Icon = role.icon

          return (
            <button
              key={role.title}
              className={clsx(
                'relative rounded-2xl border p-4 text-left transition',
                role.active
                  ? 'border-brand-primary bg-[#F2FBF8]'
                  : 'border-[#D7DEDB] bg-white'
              )}
            >
              {role.active && (
                <div className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border border-brand-primary">
                  <Check className="h-2.5 w-2.5 text-brand-primary" />
                </div>
              )}

              <Icon className="h-4 w-4 text-[#4B5563]" />

              <h3
                className={clsx(
                  'mt-4 text-[14px] font-semibold',
                  role.active
                    ? 'text-brand-primary'
                    : 'text-[#202939]'
                )}
              >
                {role.title}
              </h3>

              <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">
                {role.desc}
              </p>

              <div
                className={clsx(
                  'mt-4 inline-flex rounded-md px-2 py-1 text-[9px] font-bold',
                  role.active
                    ? 'bg-brand-primary text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280]'
                )}
              >
                {role.level}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}