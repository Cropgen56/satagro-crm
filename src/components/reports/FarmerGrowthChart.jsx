// FarmerGrowthChart.jsx

export default function FarmerGrowthChart() {
  const bars = [40, 55, 45, 70, 85, 65, 95, 75, 60, 80]

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[28px] font-semibold text-brand-primary">
            Farmer Growth Trend
          </h3>

          <p className="text-sm text-[#7A7A7A]">
            Cumulative and daily registration trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-[#F4F4F4] px-3 py-1 text-xs font-semibold">
            Weekly
          </button>

          <button className="rounded-lg bg-[#F4F4F4] px-3 py-1 text-xs font-semibold">
            Monthly
          </button>
        </div>
      </div>

      <div className="mt-10 flex h-[260px] items-end justify-between gap-3">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`w-full rounded-t-xl ${
              index === 6
                ? 'bg-brand-primary'
                : 'bg-[#D5DFDD]'
            }`}
            style={{ height: `${bar}%` }}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-between px-1 text-xs text-[#7A7A7A]">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
      </div>
    </div>
  )
}