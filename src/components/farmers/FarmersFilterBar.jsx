import { Search, X, Loader2 } from 'lucide-react'

export default function FarmersFilterBar({
  search = '',
  searching = false,
  onSearchChange,
  clients = [],
  clientId = '',
  onClientChange,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          inputMode="search"
          aria-label="Search farmers"
          placeholder="Search name, phone, email, village, or FR-ID..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && search) onSearchChange?.('')
          }}
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-16 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-label="Searching" />
          ) : null}
          {search ? (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              aria-label="Clear search"
              className="rounded-md p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      {clients.length > 0 ? (
        <select
          value={clientId}
          onChange={(e) => onClientChange?.(e.target.value)}
          aria-label="Filter by client"
          className="h-10 rounded-lg border border-gray-200 bg-gray-50/80 px-3 text-sm text-gray-700 outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
        >
          <option value="">All farmers</option>
          <option value="none">BioDrops farmers (direct)</option>
          <option value="any">All client farmers</option>
          <optgroup label="Client">
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.organizationName}
              </option>
            ))}
          </optgroup>
        </select>
      ) : null}
    </div>
  )
}
