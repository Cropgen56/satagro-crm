import { useEffect, useState } from 'react'
import { Users, CheckCircle2, Clock3, Ban } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/dashboard/StatCard'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { fetchUserManagementStats } from '@/lib/usermanagement'

export default function DashboardPage() {
  const { displayName, roleLabel } = useAuth()
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState('')

  useEffect(() => {
    let active = true
    fetchUserManagementStats()
      .then((res) => {
        if (active) setStats(res?.stats || null)
      })
      .catch((err) => {
        if (active) setStatsError(err.message || 'Could not load stats')
      })
    return () => {
      active = false
    }
  }, [])

  const fmt = (n) => (stats && n != null ? String(n) : '—')

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Dashboard" />

      <p className="mb-6 text-sm text-gray-600">
        Welcome back, <span className="font-semibold text-gray-900">{displayName}</span>
        {roleLabel ? (
          <>
            {' '}
            · <span className="text-gray-500">{roleLabel}</span>
          </>
        ) : null}
      </p>

      {statsError ? <p className="mb-4 text-sm text-amber-700">{statsError}</p> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="CRM Users"
          value={fmt(stats?.totalUsers)}
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="Active"
          value={fmt(stats?.active)}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          label="Pending"
          value={fmt(stats?.pending)}
          icon={Clock3}
          accent="yellow"
        />
        <StatCard
          label="Disabled"
          value={fmt(stats?.disabled)}
          icon={Ban}
          accent="red"
        />
      </div>

      <EmptyState
        title="Operational metrics coming soon"
        description="Farmer, subscription, and advisory analytics will appear here once those modules are connected to CropGen."
      />
    </div>
  )
}
