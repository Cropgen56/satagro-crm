export default function ReportingStructure() {
  return (
    <div>
      <h2 className="text-[16px] font-semibold text-[#202939]">Reporting Structure</h2>
      <p className="mt-3 text-sm text-gray-500">
        Select a parent admin from your organization. Manager lookup will be available
        when the admin directory API is connected.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-[#4B5563]">
            Parent Admin
          </label>
          <input
            disabled
            placeholder="Search parent admin…"
            className="h-12 w-full rounded-xl border border-[#CBD5D1] bg-gray-50 px-4 text-sm text-gray-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-[#4B5563]">
            Reporting Manager
          </label>
          <input
            disabled
            placeholder="Search manager…"
            className="h-12 w-full rounded-xl border border-[#CBD5D1] bg-gray-50 px-4 text-sm text-gray-400"
          />
        </div>
      </div>
    </div>
  )
}
