import { useCallback, useEffect, useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import FarmersPageHeader from '@/components/farmers/FarmersPageHeader'
import FarmersTable from '@/components/farmers/FarmersTable'
import FarmerSummaryCard from '@/components/farmers/FarmerSummaryCard'
import EmptyState from '@/components/ui/EmptyState'
import { fetchFarmers, fetchFarmerStats } from '@/lib/farmers'
import { Sprout, Users, MapPin, BadgeCheck } from 'lucide-react'

export default function FarmersPage() {
  const [farmers, setFarmers] = useState([])
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const load = useCallback(
    async (page = 1, searchQuery = search) => {
      try {
        setLoading(true)
        setError('')
        const [statsRes, listRes] = await Promise.all([
          fetchFarmerStats(),
          fetchFarmers({
            page,
            limit: 20,
            ...(searchQuery?.trim() ? { search: searchQuery.trim() } : {}),
          }),
        ])
        setStats(statsRes?.stats || null)
        setFarmers(listRes?.farmers || [])
        setPagination(listRes?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load farmers')
        setFarmers([])
      } finally {
        setLoading(false)
      }
    },
    [search]
  )

  useEffect(() => {
    const delay = search ? 350 : 0
    const timer = setTimeout(() => load(1, search), delay)
    return () => clearTimeout(timer)
  }, [search, load])

  const summaryCards = [
    {
      label: 'Total farmers',
      value: stats?.total ?? '—',
      note: 'BIODROPS org',
      noteVariant: 'neutral',
      icon: Users,
      iconBg: 'bg-[#E7EFEC]',
      iconColor: 'text-brand-primary',
    },
    {
      label: 'Active subscriptions',
      value: stats?.active ?? '—',
      note: 'Paid / active',
      noteVariant: 'success',
      icon: BadgeCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'With farm plots',
      value: stats?.withFields ?? '—',
      note: 'Has fields',
      noteVariant: 'neutral',
      icon: MapPin,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total acreage',
      value: stats?.totalAcres != null ? `${stats.totalAcres} ac` : '—',
      note: 'Registered land',
      noteVariant: 'neutral',
      icon: Sprout,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-700',
    },
  ]

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mx-auto mt-6 max-w-[1400px] space-y-6">
        <FarmersPageHeader />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <FarmerSummaryCard key={card.label} {...card} />
          ))}
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && farmers.length === 0 && !error ? (
          <EmptyState
            icon={Sprout}
            title="No farmers yet"
            description="Farmers with role farmer in the BIODROPS organization will appear here."
          />
        ) : (
          <FarmersTable
            farmers={farmers}
            loading={loading}
            pagination={pagination}
            search={search}
            onSearchChange={setSearch}
            onPageChange={(page) => load(page, search)}
          />
        )}
      </div>
    </div>
  )
}
