import { ChevronDown, RotateCcw, Search } from 'lucide-react'

const filters = ['State', 'District', 'Village', 'Status']

export default function FarmersFilterBar() {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search name, phone, or ID..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
          className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  )
}
