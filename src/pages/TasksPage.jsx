import PageTopBar from '@/components/layout/PageTopBar'
import DistrictMapWidget from '@/components/tasks/DistrictMapWidget'
import TaskEfficiencyWidget from '@/components/tasks/TaskEfficiencyWidget'
import TaskKpiCard from '@/components/tasks/TaskKpiCard'
import TasksPageHeader from '@/components/tasks/TasksPageHeader'
import TasksTable from '@/components/tasks/TasksTable'
import { tasksData, tasksKpis } from '@/data/tasks'

export default function TasksPage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <TasksPageHeader />
      </div>

      <div className="mb-8 mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tasksKpis.map((kpi) => (
          <TaskKpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <TasksTable tasks={tasksData} />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DistrictMapWidget />
        </div>
        <TaskEfficiencyWidget />
      </div>
    </div>
  )
}
