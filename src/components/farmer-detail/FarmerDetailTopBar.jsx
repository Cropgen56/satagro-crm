import { Bell, ChevronRight, MapPin, Search, Settings } from 'lucide-react'

export default function FarmerDetailTopBar() {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <MapPin className="h-4 w-4 text-brand-primary" />
        <span>India</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Maharashtra</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-800">Pune</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden flex-1 sm:block sm:min-w-[280px] lg:min-w-[360px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search leads, farms, or ID..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <button
          type="button"
          className="relative rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
