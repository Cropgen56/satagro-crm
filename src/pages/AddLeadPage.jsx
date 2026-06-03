import { useNavigate } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import { Target } from 'lucide-react'

export default function AddLeadPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <EmptyState
          icon={Target}
          title="Add lead"
          description="Lead creation will be available when the leads API is connected to this CRM."
        />
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            Back to leads
          </button>
        </div>
      </div>
    </div>
  )
}
