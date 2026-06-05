// SettingsSidebar.jsx

import {
  Settings2,
  Building2,
  KeyRound,
  MessageSquareText,
  Radio,
  Shield,
  Network,
  ClipboardList,
} from 'lucide-react'

const items = [
  {
    label: 'General',
    icon: Settings2,
    active: true,
  },
  {
    label: 'Organization',
    icon: Building2,
  },
  {
    label: 'User Roles & Permissions',
    icon: KeyRound,
  },
  {
    label: 'Notifications',
    icon: MessageSquareText,
  },
  {
    label: 'Advisory Settings',
    icon: Radio,
  },
  {
    label: 'Security',
    icon: Shield,
  },
  {
    label: 'Integrations',
    icon: Network,
  },
  {
    label: 'Audit Logs',
    icon: ClipboardList,
  },
]

export default function SettingsSidebar() {
  return (
    <div className="h-fit rounded-[24px] bg-white p-4 shadow-sm">
      <div className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition ${
                item.active
                  ? 'bg-brand-primary text-white'
                  : 'text-[#4B5563] hover:bg-[#F5F7F6]'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />

              <span className="text-[15px] font-medium">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}