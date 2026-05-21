import { Calendar, ChevronDown } from 'lucide-react'

const filters = [
  { label: 'Status: All', value: 'status' },
  { label: 'Priority: All', value: 'priority' },
  { label: 'Assigned User', value: 'user' },
  { label: 'Farmer', value: 'farmer' },
  { label: 'District', value: 'district' },
]

export default function TasksFilterBar() {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            {f.label}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Calendar className="h-4 w-4 text-gray-400" />
          Due Date
        </button>
      </div>
      <button type="button" className="text-sm font-medium text-brand-primary hover:text-brand-950">
        Reset Filters
      </button>
    </div>
  )
}
