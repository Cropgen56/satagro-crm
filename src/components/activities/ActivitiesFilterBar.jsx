import { Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react'

const filters = ['Activity Type', 'Assigned Agent', 'Status', 'District']

export default function ActivitiesFilterBar() {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </span>
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            {filter}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Calendar className="h-4 w-4 text-gray-400" />
          Oct 12 - Oct 19, 2023
        </button>
      </div>
      <button type="button" className="text-sm font-medium text-brand-primary hover:text-brand-950">
        Clear All
      </button>
    </div>
  )
}
