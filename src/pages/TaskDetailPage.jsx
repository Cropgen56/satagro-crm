import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import TaskActionBar from '@/components/tasks/TaskActionBar'
import TaskDetailTabs from '@/components/tasks/TaskDetailTabs'
import TaskProfileHeader from '@/components/tasks/TaskProfileHeader'
import TaskTabPanel from '@/components/tasks/TaskTabPanel'
import TaskAttachmentsTab from '@/components/tasks/tabs/TaskAttachmentsTab'
import TaskCommentsTab from '@/components/tasks/tabs/TaskCommentsTab'
import TaskOverviewTab from '@/components/tasks/tabs/TaskOverviewTab'
import TaskTimelineTab from '@/components/tasks/tabs/TaskTimelineTab'
import { getTaskById } from '@/data/tasks'

export default function TaskDetailPage() {
  const { id } = useParams()
  const task = getTaskById(id)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8 space-y-8">
        <TaskProfileHeader task={task} />
        <TaskActionBar />
        <TaskDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <TaskTabPanel>
        {activeTab === 'overview' && <TaskOverviewTab task={task} />}
        {activeTab === 'comments' && <TaskCommentsTab task={task} />}
        {activeTab === 'timeline' && <TaskTimelineTab task={task} />}
        {activeTab === 'attachments' && <TaskAttachmentsTab task={task} />}
      </TaskTabPanel>
    </div>
  )
}
