import PageTopBar from '@/components/layout/PageTopBar'
import LeadKpiCard from '@/components/leads/LeadKpiCard'
import LeadsPageHeader from '@/components/leads/LeadsPageHeader'
import LeadsTable from '@/components/leads/LeadsTable'
import { leadsData, leadsKpis } from '@/data/leads'

export default function LeadsPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <LeadsPageHeader />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {leadsKpis.map((kpi) => (
          <LeadKpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <LeadsTable leads={leadsData} />
    </div>
  )
}
