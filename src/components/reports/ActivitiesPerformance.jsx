// ActivitiesPerformance.jsx

const activities = [
  {
    label: 'Soil Testing',
    value: '92%',
    width: '92%',
  },
  {
    label: 'Crop Scouting',
    value: '78%',
    width: '78%',
  },
  {
    label: 'Pest Identification',
    value: '65%',
    width: '65%',
  },
  {
    label: 'Yield Estimation',
    value: '84%',
    width: '84%',
  },
]

export default function ActivitiesPerformance() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-[28px] font-semibold text-brand-primary">
        Activities Performance
      </h3>

      <p className="text-sm text-[#7A7A7A]">
        Productivity by activity type
      </p>

      <div className="mt-10 space-y-8">
        {activities.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[#111827]">
                {item.label}
              </span>

              <span className="text-sm font-semibold text-[#6B7280]">
                {item.value}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-brand-primary"
                style={{ width: item.width }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}