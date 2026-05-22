// ReportsHeader.jsx

import {
  Download,
  CalendarDays,
  Settings2,
} from 'lucide-react'

export default function ReportsHeader() {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
          Reports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Analyze operational performance and business insights
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950">
          <Download className="h-4 w-4" />
          Export Report
        </button>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Settings2 className="h-4 w-4" />
            Report Settings
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <CalendarDays className="h-4 w-4" />
            Schedule Report
          </button>
        </div>
      </div>
    </header>
  )
}