import PageTopBar from '@/components/layout/PageTopBar'
import ActivitiesPageHeader from '@/components/activities/ActivitiesPageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { Activity } from 'lucide-react'

export default function ActivitiesPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <ActivitiesPageHeader />
      </div>
      <div className="mt-8">
        <EmptyState
          icon={Activity}
          title="No activities logged"
          description="Field activities and engagements will appear here once connected to CropGen."
        />
      </div>
    </div>
  )
}
