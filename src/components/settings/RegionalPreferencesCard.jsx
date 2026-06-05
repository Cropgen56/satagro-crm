// RegionalPreferencesCard.jsx

import { Globe } from 'lucide-react'

export default function RegionalPreferencesCard({ user }) {
  const country = user?.country || '—'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '—'
  const browserLanguage =
    typeof window !== 'undefined' ? window.navigator?.language : null
  const language = user?.language || browserLanguage || '—'

  return (
    <div className="rounded-[26px] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F1E6]">
          <Globe className="h-4.5 w-4.5 text-brand-primary" />
        </div>

        <h2 className="text-[21px] font-semibold text-brand-primary">
          Regional Preferences
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
            Default Country
          </label>

          <input
            value={country}
            readOnly
            className="h-[52px] w-full rounded-2xl border border-[#CAD3CF] px-4 text-[15px] text-[#1F2937] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
            Timezone
          </label>

          <input
            value={timezone}
            readOnly
            className="h-[52px] w-full rounded-2xl border border-[#CAD3CF] px-4 text-[15px] text-[#1F2937] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
            Language
          </label>

          <input
            value={language}
            readOnly
            className="h-[52px] w-full rounded-2xl border border-[#CAD3CF] px-4 text-[15px] text-[#1F2937] outline-none"
          />
        </div>
      </div>
    </div>
  )
}