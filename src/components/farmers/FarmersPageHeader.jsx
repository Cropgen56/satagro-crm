import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronDown, Globe, UserPlus } from 'lucide-react'

export default function FarmersPageHeader() {
  const navigate = useNavigate()

  return (
    <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Farmers</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and monitor all farmer records</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
        >
          All Countries
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
        >
          Select State
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50"
          aria-label="Calendar"
        >
          <Calendar className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50"
          aria-label="Language"
        >
          <Globe className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => navigate('/farmers/add')}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
        >
          <UserPlus className="h-4 w-4" />
          Add Farmer
        </button>
      </div>
    </header>
  )
}
