import { Link } from 'react-router-dom'
import SubscriptionHeader from '@/components/subscriptions/SubscriptionHeader'
import { CreditCard, Layers } from 'lucide-react'

export default function SubscriptionPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <SubscriptionHeader />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
        <Link
          to="/subscriptions/cards"
          className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-brand-primary/30 hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7EFEC] text-brand-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-brand-primary">
            Product cards
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate batches, track redemption, and view per-card activity.
          </p>
        </Link>

        <Link
          to="/subscriptions/plans"
          className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-brand-primary/30 hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7EFEC] text-brand-primary">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-brand-primary">
            Subscription plans
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create and edit per-acre Razorpay plans shown in the BioDrops app.
          </p>
        </Link>
      </div>
    </div>
  )
}
