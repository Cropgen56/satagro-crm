// components/usermanagement/region-rules/RegionRulesMain.jsx

import {
  Globe2,
  Flag,
  Map,
  MapPin,
  LocateFixed,
  ChevronDown,
  ChevronRight,
  Folder,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react'

const scopes = [
  [Globe2, 'Global Access', 'Full organizational visibility', false],
  [Flag, 'Country Access', 'Limited to specific nations', false],
  [Map, 'State Access', 'Provincial level monitoring', true],
  [MapPin, 'District Access', 'Localized operational control', false],
  [LocateFixed, 'Assigned Only', 'Strict record-level ownership', false],
]

export default function RegionRulesMain() {
  return (
    <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[0.75fr_1.45fr_0.75fr]">
      <div>
        <h3 className="mb-3 text-[12px] font-semibold uppercase text-[#4B5563]">
          Region Scope
        </h3>

        <div className="space-y-3">
          {scopes.map(([Icon, title, desc, active]) => (
            <button
              key={title}
              className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-white p-4 text-left shadow-sm ${
                active
                  ? 'border-brand-primary bg-[#EAF8F4]'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${active ? 'text-brand-primary' : 'text-[#4B5563]'}`} />

                <div>
                  <p className="text-sm font-semibold text-[#202939]">
                    {title}
                  </p>

                  <p className="text-[11px] text-[#6B7280]">
                    {desc}
                  </p>
                </div>
              </div>

              {active && (
                <CheckCircle2 className="h-4 w-4 text-brand-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[12px] font-semibold uppercase text-[#4B5563]">
          Territory Assignment
        </h3>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Country', 'India'],
              ['State', 'Maharashtra'],
              ['District', 'Multiple (12)'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="mb-2 text-xs text-[#4B5563]">{label}</p>

                <button className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-[#CBD5D1] bg-[#F8FAF9] px-4 text-sm text-[#202939]">
                  {value}
                  <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[#D8DFDC] bg-[#F1F4F2] p-5">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <ChevronDown className="h-4 w-4 text-[#4B5563]" />
                <Folder className="h-4 w-4 text-brand-primary" />
                <span className="text-[16px] font-semibold text-[#202939]">
                  India
                </span>
              </div>

              <div className="ml-8 space-y-5">
                <div className="flex items-center gap-3">
                  <ChevronDown className="h-4 w-4 text-[#4B5563]" />
                  <Folder className="h-4 w-4 text-brand-primary" />
                  <span className="text-[16px] font-semibold text-[#202939]">
                    Maharashtra
                  </span>
                </div>

                <div className="ml-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <ChevronRight className="h-4 w-4 text-[#4B5563]" />
                    <Folder className="h-4 w-4 text-brand-primary" />
                    <span className="text-[15px] text-[#202939]">Pune</span>
                    <span className="rounded-full bg-[#DFF3EE] px-3 py-1 text-xs font-medium text-brand-primary">
                      Selected
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-50">
                    <ChevronRight className="h-4 w-4 text-[#4B5563]" />
                    <Folder className="h-4 w-4 text-[#6B7280]" />
                    <span className="text-[15px] text-[#4B5563]">
                      Mumbai City
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
              alt=""
              className="h-[210px] w-full object-cover grayscale"
            />

            <div className="absolute right-5 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#202939] shadow-sm">
              ● 12 Active Districts
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[12px] font-semibold uppercase text-[#4B5563]">
          Visibility Summary
        </h3>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm leading-5 text-[#4B5563]">
              Total
              <br />
              Coverage
            </p>

            <p className="text-center text-[16px] font-semibold text-[#202939]">
              14
              <br />
              Entities
            </p>
          </div>

          <div className="mt-5 h-2 rounded-full bg-[#D8DFDC]">
            <div className="h-full w-[75%] rounded-full bg-brand-primary" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['1 Country', '1 State', '12 Districts'].map((item) => (
              <span
                key={item}
                className="rounded-md bg-[#F1F4F2] px-3 py-1 text-[11px] text-[#4B5563]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="my-6 border-t border-[#E5E7EB]" />

          <h4 className="text-[12px] font-semibold uppercase text-[#4B5563]">
            Module Scope
          </h4>

          <div className="mt-4 space-y-4 text-sm text-[#202939]">
            <div className="flex items-center justify-between">
              CRM Leads <Eye className="h-4 w-4 text-brand-primary" />
            </div>

            <div className="flex items-center justify-between">
              Crop Analytics <Eye className="h-4 w-4 text-brand-primary" />
            </div>

            <div className="flex items-center justify-between">
              Financials <EyeOff className="h-4 w-4 text-[#6B7280]" />
            </div>
          </div>

          <div className="mt-7 rounded-xl border border-[#F59E0B] bg-[#FFF7E6] p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-[#D97706]" />

              <div>
                <p className="text-sm font-semibold text-[#9A3412]">
                  Territory Conflict
                </p>

                <p className="text-xs leading-5 text-[#9A3412]">
                  State Admin (MH) overlaps with Zonal Lead (Pune) in 4 districts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-3">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F1F4F2] px-6 py-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[#4B5563]">
              Region Access Operational Rules
            </h3>

            <button className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-primary">
              <SlidersHorizontal className="h-4 w-4" />
              Filter Table
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr>
                {['Module Name', 'Scope Logic', 'Visibility Filter', 'Inheritance', 'Action'].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-5 text-left text-[12px] font-medium tracking-wide text-[#374151]"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[
                ['Farmer Directory', 'STRICT_REGIONAL', 'Assigned District Code', true],
                ['Yield Forecasting', 'AGGREGATED_VIEW', 'State Performance KPI', true],
                ['Fleet Management', 'GLOBAL_SHARED', 'Inter-state Assets', false],
              ].map(([name, scope, filter, inherited]) => (
                <tr key={name} className="border-t border-[#E5E7EB]">
                  <td className="px-6 py-6 text-[15px] text-[#202939]">
                    {name}
                  </td>

                  <td className="px-6 py-6">
                    <span
                      className={`rounded-md px-3 py-1 text-[11px] ${
                        scope === 'GLOBAL_SHARED'
                          ? 'bg-[#E5E7EB] text-[#6B7280]'
                          : 'bg-[#D9F7EF] text-brand-primary'
                      }`}
                    >
                      {scope}
                    </span>
                  </td>

                  <td className="px-6 py-6 text-[15px] text-[#4B5563]">
                    {filter}
                  </td>

                  <td className="px-6 py-6">
                    {inherited ? (
                      <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                    ) : (
                      <span className="text-[#B8C2BE]">⊗</span>
                    )}
                  </td>

                  <td className="px-6 py-6">
                    <SlidersHorizontal className="h-5 w-5 cursor-pointer text-[#374151]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}