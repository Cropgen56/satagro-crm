// pages/CreateRolePage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import CreateRoleLayout from '@/components/usermanagement/create-role/CreateRoleLayout'

export default function CreateRolePage() {
  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <CreateRoleLayout />
      </div>
    </div>
  )
}