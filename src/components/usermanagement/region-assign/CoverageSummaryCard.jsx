export default function CoverageSummaryCard() {
  return (
    <div className="rounded-[22px] border border-brand-primary bg-white p-5">
      <h3 className="text-[14px] font-bold uppercase tracking-wide text-brand-primary">
        Coverage Summary
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#F5F7F6] p-4">
          <p className="text-[38px] font-bold text-brand-primary">
            1 / 1
          </p>

          <p className="mt-2 text-[14px] text-[#4B5563]">
            Country / State
          </p>
        </div>

        <div className="rounded-2xl bg-[#F5F7F6] p-4">
          <p className="text-[38px] font-bold text-brand-primary">
            2
          </p>

          <p className="mt-2 text-[14px] text-[#4B5563]">
            Districts
          </p>
        </div>

        <div className="col-span-2 rounded-2xl bg-[#F5F7F6] p-4">
          <p className="text-[38px] font-bold text-brand-primary">
            142
          </p>

          <p className="mt-2 text-[14px] text-[#4B5563]">
            Villages under operation
          </p>
        </div>
      </div>
    </div>
  )
}