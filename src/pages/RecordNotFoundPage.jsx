import { useNavigate } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import { FileQuestion } from 'lucide-react'

export default function RecordNotFoundPage({ backTo = '/dashboard', label = 'Record' }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <EmptyState
          icon={FileQuestion}
          title={`${label} not found`}
          description="This item is not available or has not been loaded from the server yet."
        />
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
