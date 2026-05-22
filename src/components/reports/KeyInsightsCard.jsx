// KeyInsightsCard.jsx

import { Lightbulb } from 'lucide-react'

export default function KeyInsightsCard() {
  return (
    <div className="rounded-[28px] bg-brand-primary p-6 text-white shadow-sm">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />

        <h3 className="text-[28px] font-semibold">
          Key Insights
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
            Revenue Growth
          </p>

          <p className="mt-1 text-sm text-white">
            Premium subscriptions are up 12% in Kenya Rift Valley region, signaling higher tech adoption.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
            Efficiency Note
          </p>

          <p className="mt-1 text-sm text-white">
            Soil testing turnaround has improved by 4 hours per agent since the new mobile task update.
          </p>
        </div>

        <button className="mt-2 w-full rounded-xl bg-white py-3 text-sm font-semibold text-brand-primary">
          Deep Dive Analysis
        </button>
      </div>
    </div>
  )
}