import PageTopBar from '@/components/layout/PageTopBar'
import LeadsPageHeader from '@/components/leads/LeadsPageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { Target } from 'lucide-react'

export default function LeadsPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <LeadsPageHeader />
      </div>
      <div className="mt-8">
        <EmptyState
          icon={Target}
          title="No leads yet"
          description="Lead pipeline data will appear here once connected to your CRM backend."
        />
      </div>
    </div>
  )
}
