import { useNavigate } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import { UserPlus } from 'lucide-react'

export default function AddFarmerPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <EmptyState
          icon={UserPlus}
          title="Add farmer"
          description="Farmer registration will be available when the farmers API is connected to this CRM."
        />
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/farmers')}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            Back to farmers
          </button>
        </div>
      </div>
    </div>
  )
}
