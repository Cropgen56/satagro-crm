// RegionalPerformanceCard.jsx

export default function RegionalPerformanceCard() {
  return (
    <div className="rounded-[28px] bg-brand-primary p-6 text-white shadow-sm">
      <h3 className="text-[18px] font-semibold">
        Regional Performance
      </h3>

      <p className="mt-4 text-[15px] leading-7 text-white/90">
        Your assigned region is currently showing 12% growth in
        active farm entries this quarter.
      </p>

      <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-[72%] rounded-full bg-white" />
      </div>

      <div className="mt-3 flex items-center justify-between text-[12px] font-semibold">
        <span>CURRENT: 72%</span>
        <span>TARGET: 100%</span>
      </div>
    </div>
  )
}