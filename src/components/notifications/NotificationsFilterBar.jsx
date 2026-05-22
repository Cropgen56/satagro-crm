// NotificationsFilterBar.jsx

import clsx from 'clsx'
import { CalendarDays, ChevronDown } from 'lucide-react'

const tabs = ['All', 'Unread', 'Mentions', 'Alerts']

export default function NotificationsFilterBar({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-[#E8E8E8] bg-[#F8F8F8] p-2 shadow-sm xl:flex-row xl:items-center xl:justify-between">
      
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'rounded-xl px-6 py-3 text-[15px] font-semibold transition-all',
              activeTab === tab
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-[#4B4B4B] hover:bg-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Notification Type */}
        <div className="flex h-11 min-w-[180px] items-center justify-between rounded-xl border border-[#E3E3E3] bg-[#EFEFEF] px-4">
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
            className="w-full appearance-none bg-transparent text-[14px] font-medium text-[#2B2B2B] outline-none"
          >
            <option>Notification Type</option>
            <option>System</option>
            <option>Critical</option>
            <option>Warning</option>
            <option>Advisory</option>
          </select>

          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
        </div>

        {/* Priority */}
        <div className="flex h-11 min-w-[140px] items-center justify-between rounded-xl border border-[#E3E3E3] bg-[#EFEFEF] px-4">
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priority: e.target.value,
              }))
            }
            className="w-full appearance-none bg-transparent text-[14px] font-medium text-[#2B2B2B] outline-none"
          >
            <option>Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
        </div>

        {/* Date */}
        <button className="flex h-11 min-w-[170px] items-center justify-center gap-2 rounded-xl border border-[#E3E3E3] bg-[#EFEFEF] px-4 text-[14px] font-medium text-[#2B2B2B]">
          <CalendarDays className="h-4 w-4" />
          Date Range
        </button>
      </div>
    </div>
  )
}