// components/usermanagement/configure-permissions/ConfigurePermissionsMain.jsx

import {
  LayoutDashboard,
  Tractor,
  CalendarCheck,
  ClipboardList,
  Tags,
  RadioTower,
  Bell,
  ChevronRight,
  Check,
  Info,
  Lock,
  AlertTriangle,
} from 'lucide-react'

const modules = [
  [LayoutDashboard, 'Dashboard', false],
  [Tractor, 'Farmers', true],
  [CalendarCheck, 'Activities', false],
  [ClipboardList, 'Tasks', false],
  [Tags, 'Subscriptions', false],
  [RadioTower, 'Advisories', false],
  [Bell, 'Notifications', false],
]

const rows = [
  ['Farmer Profiles', true, true, true],
  ['Land Records', true, true, false],
  ['Crop Data', true, true, true],
  ['Documents', true, false, true],
  ['Subscriptions', true, false, false],
  ['Advisory Access', true, true, true],
]

export default function ConfigurePermissionsMain() {
  return (
    <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[0.75fr_1.6fr_0.75fr]">
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="border-b border-[#CBD5D1] px-5 py-4">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-[#4B5563]">
            Module Categories
          </h3>
        </div>

        <div className="space-y-2 p-3">
          {modules.map(([Icon, label, active]) => (
            <button
              key={label}
              className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                active
                  ? 'border-l-4 border-brand-primary bg-[#E7EFEC] text-brand-primary'
                  : 'text-[#4B5563] hover:bg-[#F8FAF9]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />

                <span className="text-[15px] font-medium">
                  {label}
                </span>
              </div>

              {active && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between bg-[#F1F4F2] px-5 py-4">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-[#4B5563]">
            Farmers Module Matrix
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-[#4B5563]">
              Bulk Enable
            </span>

            <div className="flex h-5 w-9 items-center rounded-full bg-[#BFC8C5] px-1">
              <div className="h-3.5 w-3.5 rounded-full bg-[#6B7280]" />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-y border-[#CBD5D1]">
              {['Sub-Module', 'View', 'Edit', 'Create'].map((head) => (
                <th
                  key={head}
                  className="px-5 py-4 text-left text-[13px] font-bold uppercase tracking-wide text-[#4B5563]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map(([name, view, edit, create]) => (
              <tr key={name} className="border-b border-[#E8ECEA]">
                <td className="px-5 py-5 text-[15px] font-semibold text-[#202939]">
                  {name}
                </td>

                {[view, edit, create].map((enabled, index) => (
                  <td key={index} className="px-5 py-5">
                    <div
                      className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border ${
                        enabled
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-[#B8C2BE] bg-white'
                      }`}
                    >
                      {enabled && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-[#4B5563]">
            Summary & KPIs
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F1F4F2] p-4">
              <p className="text-[11px] uppercase text-[#6B7280]">
                Total Active
              </p>

              <h4 className="mt-1 text-2xl font-bold text-brand-primary">
                42
              </h4>
            </div>

            <div className="rounded-xl bg-[#F1F4F2] p-4">
              <p className="text-[11px] uppercase text-[#6B7280]">
                Restricted
              </p>

              <h4 className="mt-1 text-2xl font-bold text-[#DC2626]">
                12
              </h4>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-[#4B5563]">
            Dependency Engine
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#CBD5D1] p-4">
              <Info className="h-5 w-5 text-brand-primary" />

              <div>
                <p className="text-sm font-semibold text-[#202939]">
                  Delete Access
                </p>

                <p className="text-xs text-[#6B7280]">
                  → Requires Edit Access
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#D8DFDC] p-4 opacity-50">
              <Lock className="h-5 w-5 text-[#6B7280]" />

              <div>
                <p className="text-sm font-semibold text-[#6B7280]">
                  Export Access
                </p>

                <p className="text-xs text-[#6B7280]">
                  → Restricted for State Admin
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#9A4A32] bg-[#FFF1EC] p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 text-[#8A3A22]" />

            <div>
              <h3 className="text-sm font-bold uppercase text-[#8A3A22]">
                Impact Analysis
              </h3>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#8A3A22]">
                128 users assigned to this role will receive updated access
                permissions immediately upon saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}