import { useNavigate } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import { ClipboardList } from 'lucide-react'

export default function CreateTaskPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <EmptyState
          icon={ClipboardList}
          title="Create task"
          description="Task creation will be available when task management is connected to the backend."
        />
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            Back to tasks
          </button>
        </div>
      </div>
    </div>
  )
}
