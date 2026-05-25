// components/usermanagement/role-settings/RoleSettingsMain.jsx

import {
  ShieldCheck,
  Globe,
  Map,
  Building2,
  MapPin,
  LayoutGrid,
  Filter,
} from 'lucide-react'

const hierarchy = [
  [ShieldCheck, 'SUPER ADMIN', '12 Users', 'bg-brand-primary text-white'],
  [Globe, 'COUNTRY ADMIN', '45 Users', 'bg-brand-primary text-white'],
  [Map, 'STATE ADMIN', '114 Users', 'bg-[#9AF0DF] text-brand-primary'],
  [Building2, 'DISTRICT OP', '320 Users', 'bg-[#9AF0DF] text-brand-primary'],
  [MapPin, 'FPO / AGENT', '793 Users', 'bg-[#E0E4E2] text-[#6B7280]'],
]

const roles = [
  ['Super Admin', 'Level 1', '12', 'Global', 'Full Access', 'System Role', 'mint'],
  ['State Admin', 'Level 3', '114', 'State-level', 'Advanced', 'Active', 'mint'],
  ['District Operator', 'Level 4', '320', 'District', 'Standard', 'Active', 'gray'],
  ['Auditor (External)', 'N/A', '2', 'Entity-level', 'Read-Only', 'Restricted', 'orange'],
]

export default function RoleSettingsMain() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-brand-primary" />

          <h2 className="text-[18px] font-medium text-brand-primary">
            Role Hierarchy Overview
          </h2>
        </div>

        <div className="mt-8 flex items-center justify-between">
          {hierarchy.map(([Icon, title, users, color], index) => (
            <div
              key={title}
              className="relative flex flex-col items-center"
            >
              {index !== 0 && (
                <div className="absolute -left-[58px] top-7 h-px w-[46px] bg-[#8DDCCD]" />
              )}

              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}>
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-4 text-[12px] font-bold text-[#111827]">
                {title}
              </p>

              <span className="mt-2 rounded-full bg-[#DDE3E0] px-3 py-1 text-[11px] font-semibold text-[#6B7280]">
                {users}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[18px] font-medium text-brand-primary">
            Organizational Roles
          </h2>

          <button className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-primary">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-[#F1F4F2]">
            <tr>
              {['ROLE NAME', 'HIERARCHY', 'USERS', 'REGION SCOPE', 'PERMISSION', 'STATUS'].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-[11px] font-bold text-[#6B7280]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {roles.map(([name, level, users, scope, permission, status, tone]) => (
              <tr
                key={name}
                className={`border-t border-[#E8ECEA] ${name === 'State Admin' ? 'bg-[#F3FFFC]' : ''}`}
              >
                <td className="px-6 py-5 text-[16px] font-semibold text-brand-primary">
                  {name}
                </td>

                <td className="px-6 py-5 text-sm text-[#374151]">
                  {level}
                </td>

                <td className="px-6 py-5 text-sm text-[#374151]">
                  {users}
                </td>

                <td className="px-6 py-5 text-sm text-[#374151]">
                  {scope}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                      tone === 'orange'
                        ? 'bg-[#FDE4DA] text-[#8A3A22]'
                        : tone === 'gray'
                        ? 'bg-[#E8ECEA] text-[#6B7280]'
                        : 'bg-[#9AF0DF] text-brand-primary'
                    }`}
                  >
                    {permission}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                      tone === 'orange'
                        ? 'bg-[#FDE4DA] text-[#8A3A22]'
                        : 'bg-[#9AF0DF] text-brand-primary'
                    }`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}