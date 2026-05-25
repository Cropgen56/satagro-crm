// components/usermanagement/create-role/CreateRoleMain.jsx

import {
  Info,
  GitBranch,
  Users,
  ScrollText,
  Gavel,
  Building2,
  Flag,
  Map,
  Landmark,
  Tractor,
  ChevronDown,
} from 'lucide-react'

const hierarchy = [
  [Building2, 'Super Admin', true],
  [Flag, 'Country Level', false],
  [Map, 'State Level', false],
  [Landmark, 'District Level', false],
  [Tractor, 'Field/FPO', false],
]

const governance = [
  ['Inherit Parent Permissions', 'Auto-sync with hierarchy above', true],
  ['Allow Custom Permissions', 'Enable per-user overrides', false],
  ['Enable Audit Logging', 'Track all actions by this role', true],
  ['Restrict Sensitive Data', 'Hide financial and PII columns', false],
]

export default function CreateRoleMain() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-brand-primary" />

          <h2 className="text-[17px] font-medium text-[#202939]">
            Role Information
          </h2>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase text-gray-400">
              Role Name
            </label>

            <input
              placeholder="e.g. Regional Field Manager"
              className="h-11 w-full rounded-lg border border-[#CBD5D1] px-4 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase text-gray-400">
              Role Code
            </label>

            <input
              placeholder="RFM-001"
              className="h-11 w-full rounded-lg border border-[#CBD5D1] px-4 text-sm outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-[11px] font-semibold uppercase text-gray-400">
              Role Description
            </label>

            <textarea
              placeholder="Briefly describe the responsibilities of this role..."
              className="h-20 w-full resize-none rounded-lg border border-[#CBD5D1] px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-brand-primary" />

          <h2 className="text-[17px] font-medium text-[#202939]">
            Hierarchy Placement
          </h2>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-5">
          {hierarchy.map(([Icon, label, active]) => (
            <button
              key={label}
              className={`flex h-[62px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border text-[11px] font-semibold ${
                active
                  ? 'border-brand-primary bg-[#F8FFFC] text-brand-primary'
                  : 'border-[#CBD5D1] bg-white text-[#374151]'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-primary" />

            <h2 className="text-[17px] font-medium text-[#202939]">
              Reporting
            </h2>
          </div>

          <div className="mt-7 space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase text-gray-400">
                Reports To
              </label>

              <div className="flex h-11 items-center justify-between rounded-lg border border-[#CBD5D1] px-4 text-sm text-[#202939]">
                Chief Operations Officer
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase text-gray-400">
                Parent Role
              </label>

              <div className="flex h-11 items-center justify-between rounded-lg border border-[#CBD5D1] px-4 text-sm text-[#202939]">
                Regional Admin
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-brand-primary" />

            <h2 className="text-[17px] font-medium text-[#202939]">
              Role Template
            </h2>
          </div>

          <div className="mt-7 space-y-3">
            <button className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-brand-primary bg-[#F8FFFC] px-4 py-4 text-left">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>

              <div>
                <p className="text-sm font-semibold text-[#202939]">
                  Blank Role
                </p>

                <p className="text-xs text-gray-500">
                  Start from scratch
                </p>
              </div>
            </button>

            <button className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-[#CBD5D1] px-4 py-4 text-left">
              <span className="h-4 w-4 rounded-full border border-[#8A94A6]" />

              <div>
                <p className="text-sm font-semibold text-[#202939]">
                  Clone Existing
                </p>

                <p className="text-xs text-gray-500">
                  Copy another role’s structure
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Gavel className="h-4 w-4 text-brand-primary" />

          <h2 className="text-[17px] font-medium text-[#202939]">
            Role Governance Rules
          </h2>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
          {governance.map(([title, desc, active]) => (
            <div
              key={title}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-[#202939]">
                  {title}
                </p>

                <p className="text-xs text-gray-500">
                  {desc}
                </p>
              </div>

              <div
                className={`flex h-6 w-11 items-center rounded-full px-1 ${
                  active ? 'justify-end bg-brand-primary' : 'justify-start bg-[#C9D3CF]'
                }`}
              >
                <div className="h-5 w-5 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}