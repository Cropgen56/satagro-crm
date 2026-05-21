import { useState } from 'react'
import { useParams } from 'react-router-dom'
import FarmerActionBar from '@/components/farmer-detail/FarmerActionBar'
import FarmerDetailTabs from '@/components/farmer-detail/FarmerDetailTabs'
import FarmerDetailTopBar from '@/components/farmer-detail/FarmerDetailTopBar'
import FarmerProfileHeader from '@/components/farmer-detail/FarmerProfileHeader'
import FarmerTabPanel from '@/components/farmer-detail/FarmerTabPanel'
import ActivitiesTab from '@/components/farmer-detail/tabs/ActivitiesTab'
import AdvisoriesTab from '@/components/farmer-detail/tabs/AdvisoriesTab'
import DocumentsTab from '@/components/farmer-detail/tabs/DocumentsTab'
import LandCropsTab from '@/components/farmer-detail/tabs/LandCropsTab'
import OverviewTab from '@/components/farmer-detail/tabs/OverviewTab'
import SubscriptionTab from '@/components/farmer-detail/tabs/SubscriptionTab'
import TasksTab from '@/components/farmer-detail/tabs/TasksTab'
import { getFarmerDetail } from '@/data/farmerDetail'

export default function FarmerDetailPage() {
  const { id } = useParams()
  const farmer = getFarmerDetail(id)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="space-y-8">
        <FarmerDetailTopBar />
        <FarmerProfileHeader farmer={farmer} />
        <FarmerActionBar />
        <FarmerDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <FarmerTabPanel>
        {activeTab === 'overview' && <OverviewTab farmer={farmer} />}
        {activeTab === 'land' && <LandCropsTab farmer={farmer} />}
        {activeTab === 'subscription' && <SubscriptionTab farmer={farmer} />}
        {activeTab === 'activities' && <ActivitiesTab farmer={farmer} />}
        {activeTab === 'advisories' && <AdvisoriesTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'documents' && <DocumentsTab />}
      </FarmerTabPanel>
    </div>
  )
}
