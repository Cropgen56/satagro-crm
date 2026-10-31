import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FarmersPageHeader from '@/components/farmers/FarmersPageHeader'
import FarmersTable from '@/components/farmers/FarmersTable'
import FarmerSummaryCard from '@/components/farmers/FarmerSummaryCard'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmModal from '@/components/ui/ConfirmModal'
import EditFarmerProfileModal from '@/components/farmer-detail/EditFarmerProfileModal'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { deleteFarmer, fetchFarmers, fetchFarmerStats } from '@/lib/farmers'
import { fetchClients } from '@/lib/clients'
import { useAuth } from '@/hooks/useAuth'
import { Sprout, Users, MapPin, Activity } from 'lucide-react'

export default function FarmersPage() {
  const [farmers, setFarmers] = useState([])
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const { isClientViewer, canManageClients, clientOrganization } = useAuth()
  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [notice, setNotice] = useState('')
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!canManageClients) return
    fetchClients()
      .then((res) => setClients(res?.clients || []))
      .catch(() => setClients([]))
  }, [canManageClients])

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const statsRes = await fetchFarmerStats()
      setStats(statsRes?.stats || null)
    } catch (err) {
      setError(err.message || 'Failed to load farmer stats')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadFarmers = useCallback(
    async (page = 1, searchQuery = debouncedSearch) => {
      try {
        setLoading(true)
        setError('')
        const listRes = await fetchFarmers({
          page,
          limit: 20,
          ...(searchQuery?.trim() ? { search: searchQuery.trim() } : {}),
          ...(clientId ? { clientId } : {}),
        })
        setFarmers(listRes?.farmers || [])
        setPagination(listRes?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load farmers')
        setFarmers([])
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, clientId],
  )

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    loadFarmers(1, debouncedSearch)
  }, [debouncedSearch, loadFarmers])

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteFarmer(pendingDelete.id)
      setNotice(`${pendingDelete.name} was deleted.`)
      setPendingDelete(null)
      loadFarmers(pagination?.page || 1, debouncedSearch)
      loadStats()
    } catch (err) {
      setError(err.message || 'Failed to delete farmer')
      setPendingDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const summaryCards = [
    {
      label: 'Total farmers',
      value: statsLoading ? '—' : (stats?.total ?? '—'),
      note: isClientViewer
        ? clientOrganization?.organizationName || 'Your organization'
        : 'BIODROPS org',
      noteVariant: 'neutral',
      icon: Users,
      iconBg: 'bg-[#E7EFEC]',
      iconColor: 'text-brand-primary',
    },
    {
      label: 'Recently active',
      value: statsLoading ? '—' : (stats?.recentlyActive ?? '—'),
      note: 'Last 30 days',
      noteVariant: 'success',
      icon: Activity,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'With farm plots',
      value: statsLoading ? '—' : (stats?.withFields ?? '—'),
      note: 'Has fields',
      noteVariant: 'neutral',
      icon: MapPin,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total acreage',
      value: statsLoading ? '—' : stats?.totalAcres != null ? `${stats.totalAcres} ac` : '—',
      note: 'Registered land',
      noteVariant: 'neutral',
      icon: Sprout,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-700',
    },
  ]

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <FarmersPageHeader onAddFarmer={() => setAdding(true)} />
        {adding ? (
          <EditFarmerProfileModal
            farmer={null}
            clients={canManageClients ? clients.filter((c) => c.status === 'active') : []}
            onSaved={(created) => {
              setAdding(false)
              if (created?.id) navigate(`/farmers/${created.id}`)
              else loadFarmers(1, debouncedSearch)
            }}
            onClose={() => setAdding(false)}
          />
        ) : null}

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
        {notice ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {notice}
          </div>
        ) : null}

        {!loading && farmers.length === 0 && !error ? (
          <EmptyState
            icon={Sprout}
            title="No farmers yet"
            description={
              isClientViewer
                ? 'Farmers who register with your organization code will appear here.'
                : 'Farmers with role farmer in the BIODROPS organization will appear here.'
            }
          />
        ) : (
          <FarmersTable
            farmers={farmers}
            loading={loading}
            pagination={pagination}
            search={search}
            onSearchChange={setSearch}
            onPageChange={(page) => loadFarmers(page, debouncedSearch)}
            showClientColumn={canManageClients}
            clients={clients}
            clientId={clientId}
            onClientChange={setClientId}
            onDelete={isClientViewer ? undefined : setPendingDelete}
          />
        )}

        <ConfirmModal
          open={Boolean(pendingDelete)}
          title="Delete farmer?"
          message={
            pendingDelete
              ? `${pendingDelete.name} (${pendingDelete.phone}) will be removed from the CRM and logged out of the app. They won't be able to log in again with this account.`
              : ''
          }
          confirmLabel="Delete farmer"
          danger
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      </div>
    </div>
  )
}
