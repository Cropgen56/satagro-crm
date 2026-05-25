// RegionAssignPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import RegionAssignLayout from '@/components/usermanagement/region-assign/RegionAssignLayout'

export default function RegionAssignPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <RegionAssignLayout />
      </div>
    </div>
  )
}