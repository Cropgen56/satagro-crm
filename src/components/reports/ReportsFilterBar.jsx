// ReportsFilterBar.jsx

import { Filter } from 'lucide-react'

export default function ReportsFilterBar({
  filters,
  setFilters,
}) {
  const selectStyles =
    'h-11 rounded-xl border border-[#ECECEC] bg-white px-4 text-[13px] font-medium text-[#1E293B] outline-none'

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex min-w-[140px] flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase text-gray-400">
          Date Range
        </label>

        <select
          value={filters.date}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              date: e.target.value,
            }))
          }
          className={selectStyles}
        >
          <option>Last 30 Days</option>
        </select>
      </div>

      <div className="flex min-w-[140px] flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase text-gray-400">
          Country
        </label>

        <select
          value={filters.country}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              country: e.target.value,
            }))
          }
          className={selectStyles}
        >
          <option>All Countries</option>
        </select>
      </div>

      <div className="flex min-w-[140px] flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase text-gray-400">
          State
        </label>

        <select
          value={filters.state}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              state: e.target.value,
            }))
          }
          className={selectStyles}
        >
          <option>All States</option>
        </select>
      </div>

      <div className="flex min-w-[140px] flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase text-gray-400">
          District
        </label>

        <select
          value={filters.district}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              district: e.target.value,
            }))
          }
          className={selectStyles}
        >
          <option>All Districts</option>
        </select>
      </div>

      <div className="flex min-w-[140px] flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase text-gray-400">
          Agent
        </label>

        <select
          value={filters.agent}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              agent: e.target.value,
            }))
          }
          className={selectStyles}
        >
          <option>All Agents</option>
        </select>
      </div>

      <div className="flex min-w-[140px] flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase text-gray-400">
          Report Type
        </label>

        <select
          value={filters.reportType}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              reportType: e.target.value,
            }))
          }
          className={selectStyles}
        >
          <option>Financial &</option>
        </select>
      </div>

      <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-white">
        <Filter className="h-4 w-4" />
      </button>
    </div>
  )
}