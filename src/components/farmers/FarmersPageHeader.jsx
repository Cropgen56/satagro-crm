import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function FarmersPageHeader() {
  const navigate = useNavigate()
  const { isClientViewer, clientOrganization } = useAuth()

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[26px]">
          Farmers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isClientViewer
            ? `Farmers registered under ${clientOrganization?.organizationName || 'your organization'}.`
            : 'All farmers registered under the BIODROPS organization.'}
        </p>
      </div>

      {isClientViewer ? null : (
        <button
          type="button"
          onClick={() => navigate('/farmers/add')}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
        >
          <UserPlus className="h-4 w-4" />
          Add farmer
        </button>
      )}
    </header>
  )
}
