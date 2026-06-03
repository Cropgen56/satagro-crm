import AdvisoryHeader from '@/components/advisory/AdvisoryHeader'
import EmptyState from '@/components/ui/EmptyState'
import { Sprout } from 'lucide-react'

export default function AdvisoryPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <AdvisoryHeader />
      <div className="mt-8">
        <EmptyState
          icon={Sprout}
          title="No advisories"
          description="Crop advisories sent to farmers will appear here when the advisory API is connected."
        />
      </div>
    </div>
  )
}
