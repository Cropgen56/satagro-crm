// InvitationSentPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import InvitationSentLayout from '@/components/usermanagement/sendinginvitation/InvitationSentLayout'

export default function InvitationSentPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <InvitationSentLayout />
      </div>
    </div>
  )
}