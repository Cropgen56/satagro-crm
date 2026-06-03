import EmptyState from '@/components/ui/EmptyState'

export default function RecentEngagements() {
  return (
    <EmptyState
      title="No recent engagements"
      description="Engagement history will appear here when activity data is connected."
      className="py-10"
    />
  )
}
