import { useNavigate } from 'react-router-dom'
import { Download, Plus,WandSparkles } from 'lucide-react'

export default function AdvisoryHeader() {
  const navigate = useNavigate()

  return (
    <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Advisories</h1>
        <p className="mt-1 text-sm text-gray-500">Create and manage farmer advisories and agricultural recommendations</p>
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
         Broadcast Advisory
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
        >
          <Plus className="h-4 w-4" />
          Create Advisory
        </button>
      </div>
    </header>
  )
}
