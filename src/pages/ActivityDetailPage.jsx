import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import ActivityActionBar from '@/components/activities/ActivityActionBar'
import ActivityDetailTabs from '@/components/activities/ActivityDetailTabs'
import ActivityProfileHeader from '@/components/activities/ActivityProfileHeader'
import ActivityTabPanel from '@/components/activities/ActivityTabPanel'
import ActivityAttachmentsTab from '@/components/activities/tabs/ActivityAttachmentsTab'
import ActivityNotesTab from '@/components/activities/tabs/ActivityNotesTab'
import ActivityOverviewTab from '@/components/activities/tabs/ActivityOverviewTab'
import ActivityTimelineTab from '@/components/activities/tabs/ActivityTimelineTab'
import { getActivityById } from '@/data/activities'

export default function ActivityDetailPage() {
  const { id } = useParams()
  const activity = getActivityById(id)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8 space-y-8">
        <ActivityProfileHeader activity={activity} />
        <ActivityActionBar />
        <ActivityDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <ActivityTabPanel>
        {activeTab === 'overview' && <ActivityOverviewTab activity={activity} />}
        {activeTab === 'notes' && <ActivityNotesTab activity={activity} />}
        {activeTab === 'timeline' && <ActivityTimelineTab activity={activity} />}
        {activeTab === 'attachments' && <ActivityAttachmentsTab />}
      </ActivityTabPanel>
    </div>
  )
}
