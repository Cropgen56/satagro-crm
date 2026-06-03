import SubscriptionHeader from '@/components/subscriptions/SubscriptionHeader'
import EmptyState from '@/components/ui/EmptyState'
import { CreditCard } from 'lucide-react'

export default function SubscriptionPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mt-2">
        <SubscriptionHeader />
      </div>
      <div className="mt-8">
        <EmptyState
          icon={CreditCard}
          title="No subscriptions"
          description="Farmer subscription data will list here when connected to CropGen billing."
        />
      </div>
    </div>
  )
}
