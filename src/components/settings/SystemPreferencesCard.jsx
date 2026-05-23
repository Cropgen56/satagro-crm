// SystemPreferencesCard.jsx

import { SlidersHorizontal } from 'lucide-react'

const preferences = [
  {
    title: 'Enable Notifications',
    description: 'Global toggle for all system alerts',
    enabled: true,
  },
  {
    title: 'Enable SMS Alerts',
    description: 'Critical weather & system updates',
    enabled: false,
  },
  {
    title: 'Auto Assign Agents',
    description: 'Intelligently route new leads to reps',
    enabled: true,
  },
  {
    title: 'Advanced Analytics',
    description: 'Beta features for predictive yield',
    enabled: false,
  },
]

export default function SystemPreferencesCard() {
  return (
    <div className="rounded-[26px] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F1E6]">
          <SlidersHorizontal className="h-4.5 w-4.5 text-brand-primary" />
        </div>

        <h2 className="text-[21px] font-semibold text-brand-primary">
          System Preferences
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {preferences.map((item) => (
          <div
            key={item.title}
            className="rounded-[22px] border border-[#EEF1EF] bg-[#FAFBFA] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1F2937]">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-[13px] text-[#6B7280]">
                  {item.description}
                </p>
              </div>

              <div
                className={`relative h-7 w-[48px] rounded-full transition ${
                  item.enabled
                    ? 'bg-brand-primary'
                    : 'bg-[#C9D3CF]'
                }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    item.enabled
                      ? 'right-1'
                      : 'left-1'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}