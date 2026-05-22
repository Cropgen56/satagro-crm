
import React, { useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import ReportsHeader from '@/components/reports/Reportsheader'
import ReportsFilterBar from '@/components/reports/ReportsFilterBar'
import ReportKpiCard from '@/components/reports/ReportKpiCard'
import FarmerGrowthChart from '@/components/reports/FarmerGrowthChart'
import SubscriptionDistribution from '@/components/reports/SubscriptionDistribution'
import AdvisoryReachCard from '@/components/reports/AdvisoryReachCard'
import ActivitiesPerformance from '@/components/reports/ActivitiesPerformance'
import KeyInsightsCard from '@/components/reports/KeyInsightsCard'
import RecentReportsTable from '@/components/reports/RecentReportsTable'

const Reportpage = () => {
  const [filters, setFilters] = useState({
    date: 'Last 30 Days',
    country: 'All Countries',
    state: 'All States',
    district: 'All Districts',
    agent: 'All Agents',
    reportType: 'Financial &',
  })

  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <ReportsHeader />
      </div>

      <div className="mt-7">
        <ReportsFilterBar
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <ReportKpiCard
          title="Total Farmers"
          value="12,482"
          trend="+8.4%"
          icon="users"
          color="bg-[#E8F6EF] text-[#005347]"
        />

        <ReportKpiCard
          title="Active Subs"
          value="8,102"
          trend="+12%"
          icon="shield"
          color="bg-[#E8F6EF] text-[#047857]"
        />

        <ReportKpiCard
          title="Revenue"
          value="$42.8k"
          trend="+5.2%"
          icon="wallet"
          color="bg-[#E8F6EF] text-[#047857]"
        />

        <ReportKpiCard
          title="Advisory Reach"
          value="94.2%"
          trend="Optimized"
          icon="signal"
          color="bg-[#E8F0FE] text-[#2563EB]"
        />

        <ReportKpiCard
          title="Activities"
          value="1,402"
          trend="Ongoing"
          icon="clipboard"
          color="bg-[#FEF3E2] text-[#D97706]"
        />

        <ReportKpiCard
          title="Task Rate"
          value="88.5%"
          trend="+2.3%"
          icon="gauge"
          color="bg-[#F3E8FF] text-[#9333EA]"
        />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
        <FarmerGrowthChart />
        <SubscriptionDistribution />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AdvisoryReachCard />
        <ActivitiesPerformance />
      </div>

      <div className="mt-5">
        <KeyInsightsCard />
      </div>

        <RecentReportsTable />
    </div>
  )
}

export default Reportpage