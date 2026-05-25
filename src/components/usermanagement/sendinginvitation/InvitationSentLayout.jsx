// components/usermanagement/sendinginvitation/InvitationSentLayout.jsx

import InvitationSentHeader from './InvitationSentHeader'
import InvitationSentContent from './InvitationSentContent'
import InvitationSentFooter from './InvitationSentFooter'

export default function InvitationSentLayout() {
  return (
    <div className="rounded-[26px] border border-[#E5E7EB] bg-white shadow-sm">
      <InvitationSentHeader />
      <InvitationSentContent />
      <InvitationSentFooter />
    </div>
  )
}