import { CheckCircle2, RefreshCw, Users, UserX } from 'lucide-react'
import FarmerSummaryCard from '@/components/farmers/FarmerSummaryCard'
import FarmersPageHeader from '@/components/farmers/FarmersPageHeader'
import FarmersTable from '@/components/farmers/FarmersTable'
import { farmersData } from '@/data/farmers'

export default function FarmersPage() {
  return (
    <div className="p-6 lg:p-8">
      <FarmersPageHeader />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FarmerSummaryCard
          label="Total Farmers"
          value="12,482"
          note="+12% from last month"
          noteVariant="success"
          showTrend
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <FarmerSummaryCard
          label="Active Subs"
          value="8,912"
          note="71.4% retention"
          noteVariant="success"
          icon={CheckCircle2}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />
        <FarmerSummaryCard
          label="Expiring Soon"
          value="421"
          note="Needs outreach"
          noteVariant="warning"
          icon={RefreshCw}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
        />
        <FarmerSummaryCard
          label="Unassigned"
          value="89"
          note="Requires attention"
          noteVariant="danger"
          icon={UserX}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      <FarmersTable farmers={farmersData} />
    </div>
  )
}
