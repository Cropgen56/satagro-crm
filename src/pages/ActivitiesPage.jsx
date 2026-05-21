import PageTopBar from '@/components/layout/PageTopBar'
import ActivitiesPageHeader from '@/components/activities/ActivitiesPageHeader'
import ActivitiesTable from '@/components/activities/ActivitiesTable'
import ActivityKpiCard from '@/components/activities/ActivityKpiCard'
import OperationalInsight from '@/components/activities/OperationalInsight'
import RecentEngagements from '@/components/activities/RecentEngagements'
import { activitiesData, activitiesKpis } from '@/data/activities'

export default function ActivitiesPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <ActivitiesPageHeader />
      </div>

      <div className="mb-8 mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {activitiesKpis.map((kpi) => (
          <ActivityKpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <ActivitiesTable activities={activitiesData} />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentEngagements />
        </div>
        <OperationalInsight />
      </div>
    </div>
  )
}
