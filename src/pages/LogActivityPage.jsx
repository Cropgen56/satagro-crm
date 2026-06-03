import { useNavigate } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import { Activity } from 'lucide-react'

export default function LogActivityPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <EmptyState
          icon={Activity}
          title="Log activity"
          description="Activity logging will be available when the activities API is connected."
        />
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/activities')}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            Back to activities
          </button>
        </div>
      </div>
    </div>
  )
}
