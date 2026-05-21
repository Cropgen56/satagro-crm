import { Sparkles } from 'lucide-react'

export default function OperationalInsight() {
  return (
    <div className="rounded-xl bg-brand-primary p-6 text-white shadow-sm">
      <Sparkles className="h-8 w-8 text-white/80" />
      <h3 className="mt-4 text-lg font-semibold">Operational Insight</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/80">
        Based on recent activities, we recommend re-routing Agent Arjun Singh for optimal coverage in
        the Pune West district.
      </p>
      <button
        type="button"
        className="mt-6 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-brand-primary hover:bg-gray-50"
      >
        Optimize Routes
      </button>
    </div>
  )
}
