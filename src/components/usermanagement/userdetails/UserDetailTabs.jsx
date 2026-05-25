// components/usermanagement/userdetails/UserDetailTabs.jsx

const tabs = ['Overview', 'Permissions', 'Regions', 'Activity Logs', 'Security', 'Devices']

export default function UserDetailTabs() {
  return (
    <div className="border-b border-[#E5E7EB]">
      <div className="flex flex-wrap gap-8">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`pb-3 text-sm font-medium ${
              index === 0
                ? 'border-b-2 border-brand-primary text-brand-primary'
                : 'text-[#4B5563]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}