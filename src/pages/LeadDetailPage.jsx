import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import LeadActionBar from '@/components/leads/LeadActionBar'
import LeadDetailTabs from '@/components/leads/LeadDetailTabs'
import LeadProfileHeader from '@/components/leads/LeadProfileHeader'
import LeadTabPanel from '@/components/leads/LeadTabPanel'
import LeadActivityTab from '@/components/leads/tabs/LeadActivityTab'
import LeadFollowUpsTab from '@/components/leads/tabs/LeadFollowUpsTab'
import LeadNotesTab from '@/components/leads/tabs/LeadNotesTab'
import LeadOverviewTab from '@/components/leads/tabs/LeadOverviewTab'
import { getLeadById } from '@/data/leads'

export default function LeadDetailPage() {
  const { id } = useParams()
  const lead = getLeadById(id)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8 space-y-8">
        <LeadProfileHeader lead={lead} />
        <LeadActionBar leadId={lead.id} />
        <LeadDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <LeadTabPanel>
        {activeTab === 'overview' && <LeadOverviewTab lead={lead} />}
        {activeTab === 'follow-ups' && <LeadFollowUpsTab lead={lead} />}
        {activeTab === 'notes' && <LeadNotesTab lead={lead} />}
        {activeTab === 'activity' && <LeadActivityTab lead={lead} />}
      </LeadTabPanel>
    </div>
  )
}
