// components/usermanagement/role-settings/RoleSettingsTop.jsx

import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const stats = [
  ['TOTAL ROLES', '12', 'text-brand-primary'],
  ['ACTIVE ROLES', '08', 'text-[#0F766E]'],
  ['CUSTOM ROLES', '04', 'text-[#78350F]'],
  ['RESTRICTED ROLES', '02', 'text-[#DC2626]'],
  ['USERS ASSIGNED', '—', 'text-brand-primary'],
]

export default function RoleSettingsTop() {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
            Role Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage operational roles, hierarchy, and centralized permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-10 cursor-pointer rounded-lg border border-brand-primary bg-white px-5 text-sm font-semibold text-brand-primary hover:bg-[#F8FAF9]">
            Export Roles
          </button>

          <button
            onClick={() => navigate('/create-role')}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value, color]) => (
          <div
            key={label}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              {label}
            </p>

            <h3 className={`mt-2 text-2xl font-bold ${color}`}>
              {value}
            </h3>
          </div>
        ))}
      </div>
    </>
  )
}