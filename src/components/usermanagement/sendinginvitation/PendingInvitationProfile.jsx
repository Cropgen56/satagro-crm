import EmptyState from '@/components/ui/EmptyState'

export default function PendingInvitationProfile() {
  return (
    <div className="mt-8">
      <EmptyState
        title="No pending invitations"
        description="Pending user invitations will appear here when invitation tracking is connected to the API."
      />
    </div>
  )
}
