// PendingInvitationPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import PendingInvitationLayout from '@/components/usermanagement/sendinginvitation/PendingInvitationLayout'

export default function PendingInvitationPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <PendingInvitationLayout />
      </div>
    </div>
  )
}