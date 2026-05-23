// SettingsHeader.jsx

export default function SettingsHeader() {
  return (
    <div className="rounded-[24px] bg-white px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.5px] text-brand-primary">
            Settings
          </h1>

          <p className="mt-1.5 text-[15px] text-[#5B5B5B]">
            Manage your organization’s global preferences and system behavior.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full border border-[#C9D3CF] bg-white px-7 py-3 text-[15px] font-semibold text-[#2B2B2B]">
            Reset Defaults
          </button>

          <button className="rounded-full bg-brand-primary px-8 py-3 text-[15px] font-semibold text-white shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}