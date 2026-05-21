import {
  AlertTriangle,
  DollarSign,
  Megaphone,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import FarmerGrowthChart from '@/components/dashboard/FarmerGrowthChart'
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed'
import StatCard from '@/components/dashboard/StatCard'
import SubscriptionDonutChart from '@/components/dashboard/SubscriptionDonutChart'
import TopAgentsList from '@/components/dashboard/TopAgentsList'

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Dashboard" showFilters />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Farmers"
          value="12,840"
          change="+12%"
          trend="up"
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="Active Subs"
          value="8,420"
          change="+5%"
          trend="up"
          icon={ShieldCheck}
          accent="green"
        />
        <StatCard
          label="Expiring Soon"
          value="156"
          change="-2%"
          trend="down"
          icon={AlertTriangle}
          accent="yellow"
        />
        <StatCard
          label="Total Revenue"
          value="$142k"
          change="+18%"
          trend="up"
          icon={DollarSign}
          accent="purple"
        />
        <StatCard
          label="Advisories"
          value="4,230"
          change="+24%"
          trend="up"
          icon={Megaphone}
          accent="teal"
        />
        <StatCard
          label="Risk Alerts"
          value="18"
          change="! High"
          trend="alert"
          icon={Star}
          accent="red"
        />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FarmerGrowthChart />
        </div>
        <SubscriptionDonutChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopAgentsList />
        <RecentActivityFeed />
      </div>
    </div>
  )
}
