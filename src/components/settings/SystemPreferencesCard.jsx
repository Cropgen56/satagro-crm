// SystemPreferencesCard.jsx

import { SlidersHorizontal } from 'lucide-react'

export default function SystemPreferencesCard({ userDetails = [] }) {
  return (
    <div className="rounded-[26px] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F1E6]">
          <SlidersHorizontal className="h-4.5 w-4.5 text-brand-primary" />
        </div>

        <h2 className="text-[21px] font-semibold text-brand-primary">
          Logged-in User Details
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {userDetails.map((item) => (
          <div
            key={item.label}
            className="rounded-[22px] border border-[#EEF1EF] bg-[#FAFBFA] p-5"
          >
            <div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1F2937]">
                  {item.label}
                </h3>

                <p className="mt-1.5 text-[13px] text-[#6B7280]">
                  {item.value || '—'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}