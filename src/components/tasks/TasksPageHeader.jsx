import { useNavigate } from 'react-router-dom'
import { Download, LayoutGrid, List, Plus } from 'lucide-react'

export default function TasksPageHeader() {
  const navigate = useNavigate()

  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Tasks</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage operational task assignments across all districts.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900"
          >
            <List className="h-4 w-4" />
            List View
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
          >
            <LayoutGrid className="h-4 w-4" />
            Board View
          </button>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
        <button
          type="button"
          onClick={() => navigate('/tasks/create')}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-brand-950"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>
    </header>
  )
}
