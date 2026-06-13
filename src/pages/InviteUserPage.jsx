import { Navigate } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import InviteUserHeader from '@/components/usermanagement/invite-user/InviteUserHeader'
import InviteUserForm from '@/components/usermanagement/invite-user/InviteUserForm'
import { useAuth } from '@/hooks/useAuth'

export default function InviteUserPage() {
  const { canInviteUsers, loading } = useAuth()

  if (!loading && !canInviteUsers) {
    return <Navigate to="/user-management" replace />
  }

  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-6">
        <InviteUserHeader />
      </div>

      <div className="mt-6">
        <InviteUserForm />
      </div>
    </div>
  )
}