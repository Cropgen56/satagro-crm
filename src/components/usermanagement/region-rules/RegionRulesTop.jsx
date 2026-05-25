// components/usermanagement/region-rules/RegionRulesTop.jsx

import { Users } from 'lucide-react'

export default function RegionRulesTop() {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
            Region Rules
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Define geographical visibility, operational boundaries, and territory access
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-10 cursor-pointer rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-brand-primary">
            Reset Region Rules
          </button>

          <button className="h-10 cursor-pointer rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white shadow-sm">
            Save Draft
          </button>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border-l-4 border-brand-primary bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="grid flex-1 grid-cols-4 gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase text-[#4B5563]">
                Active Role
              </p>
              <p className="mt-1 text-[17px] font-semibold text-brand-primary">
                State Admin
              </p>
            </div>

            <div className="border-l border-[#CBD5D1] pl-6">
              <p className="text-[11px] font-medium uppercase text-[#4B5563]">
                Access Level
              </p>
              <p className="mt-1 text-[15px] text-[#202939]">
                Level 3
              </p>
            </div>

            <div className="border-l border-[#CBD5D1] pl-6">
              <p className="text-[11px] font-medium uppercase text-[#4B5563]">
                Role Code
              </p>
              <p className="mt-1 text-[15px] text-[#202939]">
                ADM-ST-01
              </p>
            </div>

            <div className="border-l border-[#CBD5D1] pl-6">
              <p className="text-[11px] font-medium uppercase text-[#4B5563]">
                Parent Authority
              </p>
              <p className="mt-1 text-[15px] text-[#202939]">
                Country Admin
              </p>
            </div>
          </div>

          <div className="ml-8 inline-flex items-center gap-3 rounded-full bg-[#F1F4F2] px-7 py-4">
            <Users className="h-5 w-5 text-brand-primary" />
            <span className="text-[15px] font-semibold text-brand-primary">
              114 Users
            </span>
          </div>
        </div>
      </div>
    </>
  )
}