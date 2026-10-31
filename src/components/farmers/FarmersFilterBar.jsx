import { Search } from 'lucide-react'

export default function FarmersFilterBar({
  search = '',
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
          type="search"
          placeholder="Search name, phone, or email..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
        />
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
