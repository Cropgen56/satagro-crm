import RegionAssignHeader from './RegionAssignHeader'
import RegionAssignSidebar from './RegionAssignSidebar'
import RegionAssignTree from './RegionAssignTree'
import RegionAssignMap from './RegionAssignMap'
import CoverageSummaryCard from './CoverageSummaryCard'
import AccessPreviewCard from './AccessPreviewCard'
import RestrictionCard from './RestrictionCard'
import RegionAssignFooter from './RegionAssignFooter'

export default function RegionAssignLayout() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-[#F7F9F8] shadow-sm">
      <RegionAssignHeader />

      <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-[0.27fr_0.95fr_0.42fr]">
        <RegionAssignSidebar />

        <div className="space-y-5">
          <RegionAssignTree />
          <RegionAssignMap />
        </div>

        <div className="space-y-5">
          <CoverageSummaryCard />
          <AccessPreviewCard />
          <RestrictionCard />
        </div>
      </div>

      <div className="px-5 pb-5">
        <RegionAssignFooter />
      </div>
    </div>
  )
}