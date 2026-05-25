import PageTopBar from '@/components/layout/PageTopBar'
import RoleAssignHeader from '@/components/usermanagement/role-assign/RoleAssignHeader'
import RoleCards from '@/components/usermanagement/role-assign/RoleCards'
import HierarchyVisualization from '@/components/usermanagement/role-assign/HierarchyVisualization'
import RolePreviewCard from '@/components/usermanagement/role-assign/RolePreviewCard'
import ReportingStructure from '@/components/usermanagement/role-assign/ReportingStructure'
import PermissionSummaryTable from '@/components/usermanagement/role-assign/PermissionSummaryTable'

export default function RoleAssignPage() {
  return (
    <div className="min-h-full bg-[#F7F9F8] p-5">
      <PageTopBar />

      <div className="mt-5">
        <RoleAssignHeader />
      </div>

      <div className="mt-5 rounded-[24px] border border-[#E4E8E7] bg-white p-5 shadow-sm">
        <RoleCards />

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_0.7fr]">
          <HierarchyVisualization />
          <RolePreviewCard />
        </div>

        <div className="mt-7">
          <ReportingStructure />
        </div>

        <div className="mt-7">
          <PermissionSummaryTable />
        </div>
      </div>
    </div>
  )
}