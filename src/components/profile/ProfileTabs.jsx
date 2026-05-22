// ProfileTabs.jsx

const tabs = [
  'Personal Information',
  'Security',
  'Notification Preferences',
  'Sessions & Devices',
]

export default function ProfileTabs() {
  return (
    <div className="border-b border-[#DFE5E2]">
      <div className="flex flex-wrap items-center gap-10">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`relative pb-5 text-[15px] font-semibold transition ${
              index === 0
                ? 'text-brand-primary'
                : 'text-[#7A7A7A]'
            }`}
          >
            {tab}

            {index === 0 && (
              <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-brand-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}