// components/usermanagement/role-settings/RoleSettingsSidebar.jsx

import {
  Plus,
  ChevronRight,
  ShieldCheck,
  Clock3,
  Shield,
  RotateCcw,
  LayoutGrid,
  Sprout,
  BarChart3,
  Users,
  RadioTower,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function RoleSettingsSidebar() {
  const navigate = useNavigate()

  const modules = [
    [Sprout, 'Farm Records', true],
    [BarChart3, 'Reports', true],
    [LayoutGrid, 'Financials', false],
    [Users, 'User View', true],
    [RadioTower, 'IoT Feeds', true],
  ]

  const actions = [
    [Plus, 'Create Custom Role', '/create-role'],
    [LayoutGrid, 'Clone Existing Role', '/create-role'],
    [RotateCcw, 'Reset Role Defaults', '/role-settings'],
    [ShieldCheck, 'View Permission Matrix', '/configure-permissions'],
  ]

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-[13px] font-bold uppercase tracking-[1px] text-brand-primary">
          Module Access : State Admin
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {modules.map(([Icon, label, active]) => (
            <div
              key={label}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold ${
                active
                  ? 'bg-[#9AF0DF] text-brand-primary'
                  : 'bg-[#F0F2F1] text-[#9CA3AF]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/configure-permissions')}
          className="mt-4 h-9 w-full cursor-pointer rounded-lg border border-[#BFD3CD] text-[12px] font-semibold text-brand-primary hover:bg-[#F8FAF9]"
        >
          Modify Permissions
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-[13px] font-bold uppercase tracking-[1px] text-brand-primary">
          Security & Governance
        </h3>

        <div className="mt-5 space-y-4">
          {[
            [Shield, 'Encrypted Audit Logs', 'All role changes are logged for SOC2 compliance.'],
            [ShieldCheck, '2FA Mandatory', 'Required for Level 1 and Level 2 hierarchy roles.'],
            [Clock3, 'Last Matrix Audit', 'Oct 24, 2023 by Security_Bot'],
          ].map(([Icon, title, desc]) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-1 h-4 w-4 text-brand-primary" />

              <div>
                <p className="text-[13px] font-semibold text-[#202939]">
                  {title}
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#6B7280]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[1.5px] text-[#7B848E]">
          Role Management
        </h3>

        <div className="space-y-3">
          {actions.map(([Icon, label, path]) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition hover:bg-[#F8FAF9]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2F0]">
                  <Icon className="h-4 w-4 text-brand-primary" />
                </div>

                <span className="text-sm font-semibold text-[#202939]">
                  {label}
                </span>
              </div>

              <ChevronRight className="h-4 w-4 text-[#6B7280]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}