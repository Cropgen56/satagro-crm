import { Calendar, ChevronDown } from 'lucide-react'

export default function PageHeader({
  title,
  subtitle = 'Overview of operations and performance',
  showFilters = false,
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {['Country: India', 'State: Punjab', 'District: Ludhiana'].map((filter) => (
            <button
              key={filter}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
            >
              {filter}
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            Oct 1 - Oct 31, 2023
          </button>
        </div>
      )}
    </header>
  )
}
