import { ArrowRight } from 'lucide-react'

export default function ChurnAlertCard() {
  return (
    <div className="relative overflow-hidden rounded-[30px] bg-[#014D40] p-8 shadow-sm">
      <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-[#3DD9C0]/20 blur-3xl" />

      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#10B981]/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <h3 className="text-[22px] font-semibold text-white">
            Churn Alert!
          </h3>

          <p className="mt-4 max-w-[250px] text-[15px] leading-8 text-[#C6F4EC]">
            12 Premium users in Pune North haven’t logged in for 15+ days.
            Their subscriptions expire soon.
          </p>
        </div>

        <button
          type="button"
          className="mt-8 flex h-[68px] items-center justify-center gap-3 rounded-[24px] bg-white text-[17px] font-semibold text-[#014D40] transition hover:scale-[1.01]"
        >
          Notify Agents
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}