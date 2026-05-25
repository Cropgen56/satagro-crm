// components/usermanagement/userdetails/UserDetailOverview.jsx

import {
  GitBranch,
  Map,
  Tractor,
  CheckCircle2,
  ClipboardList,
  RadioTower,
  Users,
  CalendarDays,
  ShieldCheck,
  Info,
  Building2,
  Star,
} from 'lucide-react'

const kpis = [
  { label: 'Farmers Managed', value: '1,284', icon: Tractor },
  { label: 'Activities Done', value: '342', icon: CheckCircle2 },
  { label: 'Tasks Assigned', value: '12', icon: ClipboardList },
  { label: 'Advisory Reach', value: '85%', icon: RadioTower },
]

const permissions = [
  ['Farmers', 'Regional (Maharashtra)', 'Full Access', 'ok'],
  ['Activities', 'District (Pune)', 'Create & Edit', 'ok'],
  ['Tasks', 'Personal + Reporting Line', 'Full Access', 'ok'],
  ['Advisories', 'Statewide View', 'View Only', 'ok'],
  ['Reports', 'Custom Selection', 'Restricted', 'info'],
]

export default function UserDetailOverview() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_220px]">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr_220px]">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-brand-primary">
                Role & Hierarchy
              </h3>
              <GitBranch className="h-4 w-4 text-gray-500" />
            </div>

            <div className="mt-7 space-y-4">
              {[
                ['Super Admin', 'National Office', false],
                ['Country Admin', 'India HQ', false],
                ['State Admin', 'Maharashtra Unit', true],
                ['District Operator', 'Pune (Lower Node)', false],
              ].map(([title, sub, active]) => (
                <div key={title} className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      active ? 'bg-brand-primary text-white' : 'bg-[#EEF2F0] text-gray-500'
                    }`}
                  >
                    {active ? <Star className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                  </div>

                  <div>
                    <p className={`text-xs ${active ? 'font-bold text-brand-primary' : 'text-gray-500'}`}>
                      {title}
                    </p>
                    <p className={`text-sm ${active ? 'font-semibold text-brand-primary' : 'text-gray-700'}`}>
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-brand-primary">
                Region Access
              </h3>
              <Map className="h-4 w-4 text-gray-500" />
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#EEF2F0] px-3 py-2 text-xs">
              <span className="rounded bg-white px-3 py-1">India</span>
              <span>/</span>
              <span className="rounded bg-[#DCEBE6] px-3 py-1 font-semibold text-brand-primary">
                Maharashtra
              </span>
              <span>/</span>
              <span className="rounded bg-white px-3 py-1">Pune</span>
            </div>

            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800"
              alt=""
              className="mt-5 h-[120px] w-full rounded-xl object-cover grayscale"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {['HAVELI DISTRICT', 'MULSHI', 'KHED', 'AMBEGAON'].map((item) => (
                <span
                  key={item}
                  className="rounded bg-[#DFF3EE] px-3 py-1 text-[10px] font-bold text-brand-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-1">
            {kpis.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
                >
                  <Icon className="h-5 w-5 text-brand-primary" />
                  <p className="mt-4 text-[11px] text-gray-500">{item.label}</p>
                  <h3 className="mt-1 text-[22px] font-bold text-brand-primary">
                    {item.value}
                  </h3>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-primary">
              Module Permissions Matrix
            </h3>
            <p className="text-[11px] text-gray-500">Last audit: 2 days ago</p>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-[#E5E7EB]">
            <table className="w-full">
              <thead className="bg-[#F2F4F3]">
                <tr>
                  {['Module', 'Access Scope', 'Access Level', 'Status'].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase text-gray-500"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {permissions.map(([module, scope, level, status]) => (
                  <tr key={module} className="border-t border-[#E5E7EB]">
                    <td className="px-4 py-4 text-sm font-semibold text-[#202939]">
                      {module}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#374151]">{scope}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#EEF2F0] px-3 py-1 text-[11px] font-semibold text-brand-primary">
                        {level}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {status === 'ok' ? (
                        <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
                      ) : (
                        <Info className="h-5 w-5 text-brand-primary" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-brand-primary">
            Recent Activity
          </h3>

          <div className="mt-5 space-y-4">
            {[
              ['Territory Updated', 'Added Ambegaon sub-di', '2 hours ago'],
              ['New Task Created', 'Soil Analysis for Pune Ea', 'Today, 9:15 AM'],
              ['System Login', 'Browser: Chrome on mac', 'Yesterday, 6:40 PM'],
            ].map(([title, desc, time]) => (
              <div key={title} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-primary" />
                <div>
                  <p className="text-sm font-semibold text-[#202939]">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                  <p className="mt-1 text-[10px] text-gray-400">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-primary" />
            <h3 className="text-sm font-semibold text-brand-primary">
              Security
            </h3>
          </div>

          <div className="mt-5 space-y-3 text-xs">
            <p>
              2FA Status <span className="float-right font-semibold text-[#16A34A]">Enabled</span>
            </p>
            <p>
              Last Pass Change <span className="float-right font-semibold">14 days ago</span>
            </p>
          </div>

          <div className="mt-7 space-y-2">
            <button className="w-full rounded-lg bg-[#E7ECE9] py-2 text-xs font-semibold text-brand-primary">
              Reset Password
            </button>
            <button className="w-full rounded-lg bg-[#E7ECE9] py-2 text-xs font-semibold text-brand-primary">
              Reassign Region
            </button>
            <button className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600">
              Suspend User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}