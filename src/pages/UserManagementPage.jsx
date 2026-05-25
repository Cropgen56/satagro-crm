// UserManagementPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import UserManagementHeader from '@/components/usermanagement/UserManagementHeader'
import UserManagementKpiCards from '@/components/usermanagement/UserManagementKpiCards'
import UserManagementTable from '@/components/usermanagement/UserManagementTable'

export default function UserManagementPage() {
  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <UserManagementHeader />
      </div>

      <div className="mt-7">
        <UserManagementKpiCards />
      </div>

      <div className="mt-8">
        <UserManagementTable />
      </div>
    </div>
  )
}