import PageTopBar from '@/components/layout/PageTopBar'
import TasksPageHeader from '@/components/tasks/TasksPageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { ClipboardList } from 'lucide-react'

export default function TasksPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <TasksPageHeader />
      </div>
      <div className="mt-8">
        <EmptyState
          icon={ClipboardList}
          title="No tasks"
          description="Tasks assigned to your team will show here when task management is enabled."
        />
      </div>
    </div>
  )
}
