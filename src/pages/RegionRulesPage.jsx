// pages/RegionRulesPage.jsx

import PageTopBar from '@/components/layout/PageTopBar'
import RegionRulesLayout from '@/components/usermanagement/region-rules/RegionRulesLayout'

export default function RegionRulesPage() {
  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <RegionRulesLayout />
      </div>
    </div>
  )
}