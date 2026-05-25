// components/usermanagement/permission/PermissionReviewCards.jsx

import {
  ShieldCheck,
  Map,
  GitBranch,
  Mail,
  MessageSquare,
  RotateCcw,
  Check,
  Minus,
  UserRound,
} from 'lucide-react'

export default function PermissionReviewCards() {
  const matrix = [
    ['Farmers', true, true, true, false, true],
    ['Activities', true, true, true, true, true],
    ['Advisories', true, true, false, false, true],
    ['Reports', true, false, false, false, true],
    ['Users', true, false, false, false, false],
  ]

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-brand-primary" />
            <h3 className="text-[18px] font-semibold text-brand-primary">
              Role & Hierarchy
            </h3>
          </div>

          <div className="rounded-full bg-[#98E5D2] px-3 py-1 text-[11px] font-bold text-brand-primary">
            LEVEL 3
          </div>
        </div>

        <div className="mt-8 space-y-4 border-l border-[#D6DDDA] pl-5">
          {['Super Admin', 'Country Admin', 'State Admin', 'District Operator'].map((role, index) => (
            <div
              key={role}
              className={`flex items-center gap-3 ${
                index === 2 ? 'font-semibold text-brand-primary' : 'text-[#7B848E]'
              }`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  index === 2
                    ? 'bg-brand-primary text-white'
                    : 'border border-[#C9D1CD] text-[#9CA3AF]'
                }`}
              >
                {index === 2 ? <UserRound className="h-3 w-3" /> : <Check className="h-3 w-3" />}
              </div>

              <span className="text-[15px]">{role}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-[#E5E7EB] pt-6">
          <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">
            ASSIGNED COMPETENCIES
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {['Manage District Records', 'Regional Analytics'].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-[#EEF2F0] px-4 py-3 text-[14px] font-semibold text-brand-primary"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-brand-primary" />
            <h3 className="text-[18px] font-semibold text-brand-primary">
              Region Access
            </h3>
          </div>

          <p className="text-[14px] font-semibold text-brand-primary">
            Pune Division
          </p>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[14px] text-[#6B7280]">
          <span>India</span>
          <span>›</span>
          <span>Maharashtra</span>
          <span>›</span>
          <span className="font-semibold text-brand-primary">Pune</span>
          <span className="rounded-md bg-brand-primary px-2 py-1 text-[12px] text-white">
            Haveli
          </span>
        </div>

        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
          alt=""
          className="mt-6 h-[290px] w-full rounded-2xl object-cover"
        />
      </div>

      <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-primary" />
          <h3 className="text-[18px] font-semibold text-brand-primary">
            Permissions Matrix
          </h3>
        </div>

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[300px] table-fixed">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="w-[44%] pb-3 text-left text-[13px] font-semibold text-[#6B7280]">
                  Module
                </th>
                {['V', 'C', 'E', 'D', 'X'].map((head) => (
                  <th
                    key={head}
                    className="w-[11.2%] pb-3 text-center text-[13px] font-semibold text-[#6B7280]"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {matrix.map((row) => (
                <tr key={row[0]} className="border-b border-[#EEF1EF] last:border-b-0">
                  <td className="py-4 pr-2 text-[14px] font-medium text-brand-primary">
                    {row[0]}
                  </td>

                  {row.slice(1).map((allowed, idx) => (
                    <td key={idx} className="py-4 text-center">
                      <div className="flex justify-center">
                        {allowed ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <Minus className="h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[22px] border border-[#F3D38A] bg-[#FFFDF8] p-6 xl:col-span-2">
        <h3 className="text-[18px] font-semibold text-[#A35312]">
          Access Restrictions
        </h3>

        <div className="mt-5 space-y-4 text-[15px] text-[#B45309]">
          <p>• Restricted to Western Zone (MAH, GUJ, GOA)</p>
          <p>• Cannot modify global configuration settings</p>
          <p>• Maximum of 500 farmer profiles allowed</p>
        </div>
      </div>

      <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9F3E5]">
            <Mail className="h-5 w-5 text-brand-primary" />
          </div>

          <h3 className="text-[18px] font-semibold text-brand-primary">
            Delivery Settings
          </h3>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-sm font-semibold text-white">
            <Mail className="h-4 w-4" />
            Email invitation
          </button>

          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-sm font-semibold text-white">
            <MessageSquare className="h-4 w-4" />
            SMS delivery
          </button>

          <button className="inline-flex h-11 items-center gap-2 rounded-full border border-[#9AA5A1] px-5 text-sm font-semibold text-brand-primary">
            <RotateCcw className="h-4 w-4" />
            Force Password Reset
          </button>
        </div>
      </div>
    </div>
  )
}