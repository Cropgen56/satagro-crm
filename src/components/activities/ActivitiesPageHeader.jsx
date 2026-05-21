import { useNavigate } from 'react-router-dom'
import { Calendar, Download, Plus } from 'lucide-react'

export default function ActivitiesPageHeader() {
  const navigate = useNavigate()

  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Activities</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track operational activities and field engagement across all sectors.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Calendar className="h-4 w-4" />
          Calendar View
        </button>
        <button
          type="button"
          onClick={() => navigate('/activities/log')}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
        >
          <Plus className="h-4 w-4" />
          Log Activity
        </button>
      </div>
    </header>
  )
}
