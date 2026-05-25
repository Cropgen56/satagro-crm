// PermissionReviewPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import PermissionsReviewLayout from '@/components/usermanagement/permission/PermissionsReviewLayout'

export default function PermissionReviewPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <PermissionsReviewLayout />
      </div>
    </div>
  )
}