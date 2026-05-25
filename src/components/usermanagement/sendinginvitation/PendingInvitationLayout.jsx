import PendingInvitationHeader from './PendingInvitationHeader'
import PendingInvitationProfile from './PendingInvitationProfile'
import PendingInvitationDetails from './PendingInvitationDetails'
import PendingInvitationFooter from './PendingInvitationFooter'

export default function PendingInvitationLayout() {
  return (
    <div>
      <PendingInvitationHeader />
      <PendingInvitationProfile />
      <PendingInvitationDetails />
      <PendingInvitationFooter />
    </div>
  )
}