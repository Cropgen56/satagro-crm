const levels = [
  'Super Admin',
  'Country Admin',
  'State Admin',
  'District Operator',
  'FPO / Agent',
]

export default function HierarchyVisualization() {
  return (
    <div className="rounded-2xl border border-[#E4E8E7] bg-[#F9FBFA] p-5">
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-brand-primary">
        Hierarchy Path Visualization
      </h3>

      <div className="mt-7 space-y-6">
        {levels.map((level, index) => (
          <div
            key={level}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  level === 'State Admin'
                    ? 'bg-brand-primary'
                    : 'border border-[#D1D5DB] bg-white'
                }`}
              />

              <span className="text-[11px] font-semibold text-[#4B5563]">
                Level {index + 1}
              </span>
            </div>

            <div
              className={`flex flex-1 items-center justify-between rounded-xl px-4 py-3 ${
                level === 'State Admin'
                  ? 'border border-[#B8D6CB] bg-[#EAF6F1]'
                  : ''
              }`}
            >
              <span
                className={`text-[14px] ${
                  level === 'State Admin'
                    ? 'font-semibold text-brand-primary'
                    : 'text-[#9CA3AF]'
                }`}
              >
                {level}
              </span>

              {level === 'State Admin' && (
                <span className="rounded-md bg-brand-primary px-2 py-1 text-[9px] font-semibold text-white">
                  Active Target
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}