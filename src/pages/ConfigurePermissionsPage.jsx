// pages/ConfigurePermissionsPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import ConfigurePermissionsLayout from '@/components/usermanagement/configure-permissions/ConfigurePermissionsLayout'

export default function ConfigurePermissionsPage() {
  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <ConfigurePermissionsLayout />
      </div>
    </div>
  )
}