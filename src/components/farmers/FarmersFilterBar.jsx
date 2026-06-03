import { Search } from 'lucide-react'

export default function FarmersFilterBar({ search = '', onSearchChange }) {
  return (
    <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search name, phone, or email..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
        />
      </div>
    </div>
  )
}
