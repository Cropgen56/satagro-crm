// pages/RoleSettingsPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import RoleSettingsLayout from '@/components/usermanagement/role-settings/RoleSettingsLayout'

export default function RoleSettingsPage() {
  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <RoleSettingsLayout />
      </div>
    </div>
  )
}