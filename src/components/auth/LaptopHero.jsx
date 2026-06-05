/** SatAgro CRM laptop mockup — pure CSS, no PNG halo */
export default function LaptopHero({ width = 320, className = '' }) {
  const screenHeight = Math.round(width * 0.58)
  const baseHeight = Math.round(width * 0.04)

  return (
    <div
      className={`relative z-40 ${className}`}
      style={{ width: `${width}px`, maxWidth: '92vw' }}
    >
      <div
        className="overflow-hidden rounded-t-xl border border-white/20 bg-[#052e16] shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
        style={{ height: `${screenHeight}px` }}
      >
        <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-brand-950 px-3">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[9px] font-medium text-white/50">SatAgro CRM</span>
        </div>

        <div className="flex h-[calc(100%-28px)]">
          <div className="flex w-[28%] flex-col gap-2 border-r border-white/10 bg-brand-primary p-2">
            <div className="h-2 w-12 rounded bg-white/20" />
            {['Dashboard', 'Farmers', 'Leads', 'Tasks'].map((item) => (
              <div
                key={item}
                className="rounded px-1.5 py-1 text-[7px] font-medium text-white/70 first:bg-white/15 first:text-white"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-2 bg-[#F5F7F6] p-2">
            <div className="grid grid-cols-3 gap-1">
              {['Users', 'Active', 'Pending'].map((label) => (
                <div key={label} className="rounded bg-white p-1.5 shadow-sm">
                  <p className="text-[6px] text-gray-400">{label}</p>
                  <p className="text-[9px] font-bold text-brand-primary">—</p>
                </div>
              ))}
            </div>
            <div className="flex-1 rounded bg-white p-1.5 shadow-sm">
              <div className="mb-1 h-1.5 w-16 rounded bg-brand-primary/20" />
              <div className="space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-brand-light" />
                    <div className="h-1.5 flex-1 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto rounded-b-lg bg-gradient-to-b from-gray-300 to-gray-400 shadow-md"
        style={{ width: `${Math.round(width * 1.08)}px`, height: `${baseHeight}px` }}
      />
      <div
        className="mx-auto rounded-full bg-gray-500/40"
        style={{ width: `${Math.round(width * 0.22)}px`, height: '3px', marginTop: '2px' }}
      />
    </div>
  )
}
