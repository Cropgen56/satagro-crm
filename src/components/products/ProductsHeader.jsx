import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function ProductsHeader() {
  const navigate = useNavigate()

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[26px]">
          Products
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage BioDrops shop catalog — prices, stock, and availability for farmers.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/products/new')}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
      >
        <Plus className="h-4 w-4" />
        Add product
      </button>
    </header>
  )
}
