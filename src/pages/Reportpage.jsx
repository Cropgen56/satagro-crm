import PageTopBar from '@/components/layout/PageTopBar'
import ReportsHeader from '@/components/reports/ReportsHeader'
import EmptyState from '@/components/ui/EmptyState'
import { BarChart3 } from 'lucide-react'

export default function Reportpage() {
  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <ReportsHeader />
      </div>
      <div className="mt-8">
        <EmptyState
          icon={BarChart3}
          title="Reports not available yet"
          description="Analytics and exportable reports will be available once reporting is connected to live data."
        />
      </div>
    </div>
  )
}
