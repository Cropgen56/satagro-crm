// pages/UserDetailPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import UserDetailHeader from '@/components/usermanagement/userdetails/UserDetailHeader'
import UserDetailTabs from '@/components/usermanagement/userdetails/UserDetailTabs'
import UserDetailOverview from '@/components/usermanagement/userdetails/UserDetailOverview'

export default function UserDetailPage() {
  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <UserDetailHeader />
      </div>

      <div className="mt-6">
        <UserDetailTabs />
      </div>

      <div className="mt-5">
        <UserDetailOverview />
      </div>
    </div>
  )
}