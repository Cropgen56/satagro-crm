// components/usermanagement/configure-permissions/ConfigurePermissionsTop.jsx

import { ShieldCheck } from 'lucide-react'

export default function ConfigurePermissionsTop() {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
            Configure Permissions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Define operational access and module-level permissions for enterprise roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-10 cursor-pointer rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-[#F8FAF9]">
            Reset to Default
          </button>

          <button className="h-10 cursor-pointer rounded-lg bg-[#98EBDD] px-5 text-sm font-semibold text-brand-primary shadow-sm">
            Save Draft
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary">
              <ShieldCheck className="h-8 w-8 text-[#9AF0DF]" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[24px] font-bold text-[#202939]">
                  State Admin
                </h2>

                <span className="rounded-full bg-brand-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Level 3
                </span>
              </div>

              <p className="mt-1 text-[11px] font-bold uppercase tracking-[2px] text-[#6B7280]">
                CODE : ADM-ST-01
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10 border-l border-[#E5E7EB] pl-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                Parent Entity
              </p>

              <p className="mt-1 text-[16px] font-semibold text-brand-primary">
                Country Admin
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                Inheritance
              </p>

              <p className="mt-1 flex items-center gap-2 text-[16px] font-semibold text-[#202939]">
                <span className="h-2 w-2 rounded-full bg-brand-primary" />
                Enabled
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                Assigned Users
              </p>

              <p className="mt-1 text-[16px] font-semibold text-[#202939]">
                114 Members
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}