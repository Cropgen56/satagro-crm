import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import {
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Sprout,
  Tractor,
  Trash2,
  Wheat,
} from 'lucide-react'
import FarmerDetailTabs from '@/components/farmer-detail/FarmerDetailTabs'
import SubscriptionTab from '@/components/farmer-detail/tabs/SubscriptionTab'
import ProductCardsTab from '@/components/farmer-detail/tabs/ProductCardsTab'
import AdvisoryTab from '@/components/farmer-detail/tabs/AdvisoryTab'
import FarmOverviewPanel from '@/components/farmer-detail/analytics/FarmOverviewPanel'
import FarmListPanel from '@/components/farmer-detail/analytics/FarmListPanel'
import FieldReportPanel from '@/components/farmer-detail/analytics/FieldReportPanel'
import FarmSelector from '@/components/farmer-detail/analytics/FarmSelector'
import FarmerClientCard from '@/components/farmer-detail/FarmerClientCard'
import EditFarmerProfileModal from '@/components/farmer-detail/EditFarmerProfileModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import useAsyncData from '@/hooks/useAsyncData'
import { useAuth } from '@/hooks/useAuth'
import { fetchFarmerFields } from '@/lib/farmAnalytics'
import { deleteFarmer, fetchFarmerById } from '@/lib/farmers'
import { CLIENT_VIEWER_FARMER_TAB_IDS, FARMER_TABS } from '@/lib/moduleConstants'
import StatusBadge from '@/components/farmers/StatusBadge'
import { UserAvatar } from '@/components/ui/EmptyState'
import RecordNotFoundPage from '@/pages/RecordNotFoundPage'

/** Tabs that act on one farm: the farm picker is shown only on these. */
const FARM_SCOPED_TABS = new Set(['overview', 'reports'])

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatLocationParts(farmer) {
  return [farmer.village, farmer.city, farmer.district, farmer.state, farmer.country]
    .filter(Boolean)
    .join(', ')
}

function formatLabel(value) {
  if (!value) return null
  return String(value).replace(/^\w/, (c) => c.toUpperCase())
}

function HeaderStat({ icon: Icon, label, value, note }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light">
        <Icon className="h-4 w-4 text-brand-primary" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <p className="truncate text-base font-semibold text-gray-900">{value}</p>
        {note ? (
          <p className="truncate text-xs text-gray-500" title={note}>
            {note}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function ContactItem({ icon: Icon, children }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      <span className="truncate">{children}</span>
    </span>
  )
}

function OrganizationBadge({ client }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        client ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600',
      )}
      title={client?.code ? `Organization code ${client.code}` : undefined}
    >
      <Building2 className="h-3.5 w-3.5" />
      {client?.name || 'BioDrops direct'}
    </span>
  )
}

function ProfileHeader({ farmer, onEdit, onDelete }) {
  const location = formatLocationParts(farmer) || farmer.location
  const crops = farmer.crops || []

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <UserAvatar
          name={farmer.name}
          avatar={farmer.avatar}
          className="h-16 w-16 shrink-0 text-lg sm:h-20 sm:w-20"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{farmer.name}</h1>
            <StatusBadge status={farmer.status} />
            <OrganizationBadge client={farmer.client} />
            <div className="ml-auto flex gap-2">
              {onEdit ? (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-primary hover:text-brand-primary"
                >
                  <Pencil className="h-4 w-4" />
                  Edit profile
                </button>
              ) : null}
              {onDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              ) : null}
            </div>
          </div>
          <p className="mt-1 font-mono text-xs text-gray-400">{farmer.uid}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
            {farmer.phone && farmer.phone !== '—' ? (
              <ContactItem icon={Phone}>
                <a href={`tel:${farmer.phone}`} className="hover:text-brand-primary">
                  {farmer.phone}
                </a>
              </ContactItem>
            ) : null}
            {farmer.email ? (
              <ContactItem icon={Mail}>
                <a href={`mailto:${farmer.email}`} className="hover:text-brand-primary">
                  {farmer.email}
                </a>
              </ContactItem>
            ) : null}
            {location ? <ContactItem icon={MapPin}>{location}</ContactItem> : null}
            <ContactItem icon={Calendar}>Joined {formatDate(farmer.createdAt)}</ContactItem>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-gray-100 bg-gray-100 lg:grid-cols-4">
        {[
          {
            icon: Tractor,
            label: 'Farms',
            value: farmer.fieldCount,
            note: farmer.fieldCount ? 'Registered plots' : 'No farms yet',
          },
          {
            icon: Sprout,
            label: 'Total area',
            value: farmer.totalAcre > 0 ? `${farmer.totalAcre.toFixed(2)} ac` : '—',
            note: 'Across all farms',
          },
          {
            icon: Wheat,
            label: 'Crops',
            value: crops.length || '—',
            note: crops.length ? crops.join(', ') : 'No crops yet',
          },
          {
            icon: Clock,
            label: 'Last active',
            value: farmer.lastAdvisory || '—',
            note: farmer.lastActiveAt ? formatDate(farmer.lastActiveAt) : 'Never',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50/60">
            <HeaderStat {...stat} />
          </div>
        ))}
      </div>
    </section>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-gray-50 py-3 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="break-words text-right text-sm font-medium text-gray-900">{value || '—'}</dd>
    </div>
  )
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <dl className="mt-3">{children}</dl>
    </div>
  )
}

function ProfilePanel({ farmer, canManageClients, onClientChange }) {
  return (
    <div className="space-y-6">
      {canManageClients ? <FarmerClientCard farmer={farmer} onChange={onClientChange} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard title="Contact & account">
          <InfoRow label="Phone" value={farmer.phone} />
          <InfoRow label="Email" value={farmer.email} />
          <InfoRow label="Language" value={formatLabel(farmer.language)} />
          <InfoRow label="Signed up via" value={formatLabel(farmer.clientSource)} />
          <InfoRow label="Terms accepted" value={farmer.termsAccepted ? 'Yes' : 'No'} />
          <InfoRow label="Joined" value={formatDate(farmer.createdAt)} />
          <InfoRow label="Last login" value={formatDate(farmer.lastLoginAt)} />
        </InfoCard>

        <InfoCard title="Location">
          <InfoRow label="Country" value={farmer.country} />
          <InfoRow label="State" value={farmer.state} />
          <InfoRow label="District" value={farmer.district} />
          <InfoRow label="City" value={farmer.city} />
          <InfoRow label="Village" value={farmer.village} />
          <InfoRow label="Pincode" value={farmer.pincode} />
          {!canManageClients ? (
            <InfoRow
              label="Organization"
              value={
                farmer.client
                  ? `${farmer.client.name}${farmer.client.code ? ` (${farmer.client.code})` : ''}`
                  : 'BioDrops direct'
              }
            />
          ) : null}
        </InfoCard>
      </div>
    </div>
  )
}

function PageShell({ children }) {
  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">{children}</div>
    </div>
  )
}

export default function FarmerDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const { isClientViewer, canManageClients } = useAuth()
  const [farmer, setFarmer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFieldId, setSelectedFieldId] = useState(location.state?.fieldId || '')
  const [fieldsVersion, setFieldsVersion] = useState(0)
  const [editingProfile, setEditingProfile] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const farmerId = farmer?.id
  const fieldsQuery = useAsyncData(farmerId ? `fields:${farmerId}:${fieldsVersion}` : null, () =>
    fetchFarmerFields(farmerId),
  )
  const fields = useMemo(() => fieldsQuery.data || [], [fieldsQuery.data])
  const selectedField = fields.find((f) => f._id === selectedFieldId) || fields[0] || null

  const tabs = useMemo(() => {
    const visible = isClientViewer
      ? FARMER_TABS.filter((tab) => CLIENT_VIEWER_FARMER_TAB_IDS.has(tab.id))
      : FARMER_TABS
    return visible.map((tab) =>
      tab.id === 'fields' && fields.length ? { ...tab, count: fields.length } : tab,
    )
  }, [isClientViewer, fields.length])

  const loadFarmer = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError('')
      const response = await fetchFarmerById(id)
      setFarmer(response?.farmer || null)
    } catch (err) {
      setFarmer(null)
      setError(err.message || 'Failed to load farmer details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadFarmer()
  }, [loadFarmer])

  const handleSubscriptionUpdated = useCallback(() => {
    setFieldsVersion((v) => v + 1)
    return loadFarmer()
  }, [loadFarmer])

  if (loading) {
    return (
      <PageShell>
        <div className="animate-pulse space-y-6" aria-label="Loading farmer profile">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-52 rounded-2xl bg-white shadow-sm" />
          <div className="h-[28rem] rounded-2xl bg-white shadow-sm" />
        </div>
      </PageShell>
    )
  }

  if (!farmer) {
    // A real failure (network, server) is not the same as "no such farmer".
    if (error && !/not found|outside your scope/i.test(error)) {
      return (
        <PageShell>
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </PageShell>
      )
    }
    return <RecordNotFoundPage backTo="/farmers" label="Farmer" />
  }

  const showFarmSelector = FARM_SCOPED_TABS.has(activeTab) && fields.length > 0

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link to="/farmers" className="font-medium hover:text-brand-primary">
          Farmers
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-gray-900">{farmer.name}</span>
      </nav>

      <ProfileHeader
        farmer={farmer}
        onEdit={() => setEditingProfile(true)}
        onDelete={isClientViewer ? undefined : () => setConfirmDelete(true)}
      />
      <ConfirmModal
        open={confirmDelete}
        title="Delete farmer?"
        message={`${farmer.name} will be removed from the CRM and logged out of the app. They won't be able to log in again with this account.`}
        confirmLabel="Delete farmer"
        danger
        busy={deleting}
        onConfirm={async () => {
          setDeleting(true)
          try {
            await deleteFarmer(farmer.id)
            navigate('/farmers', { replace: true })
          } catch (err) {
            setError(err.message || 'Failed to delete farmer')
            setConfirmDelete(false)
            setDeleting(false)
          }
        }}
        onCancel={() => setConfirmDelete(false)}
      />
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {editingProfile ? (
        <EditFarmerProfileModal
          farmer={farmer}
          onSaved={(updated) => {
            if (updated) setFarmer(updated)
            setEditingProfile(false)
          }}
          onClose={() => setEditingProfile(false)}
        />
      ) : null}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-6 pt-3 lg:flex-row lg:items-center lg:justify-between">
          <FarmerDetailTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
          {showFarmSelector ? (
            <div className="pb-3 lg:pb-0">
              <FarmSelector
                fields={fields}
                selectedField={selectedField}
                onSelect={setSelectedFieldId}
              />
            </div>
          ) : null}
        </div>

        <div className="p-6">
          {activeTab === 'overview' ? (
            <FarmOverviewPanel
              farmer={farmer}
              fields={fields}
              selectedField={selectedField}
              fieldsLoading={fieldsQuery.loading}
              fieldsError={fieldsQuery.error}
            />
          ) : null}
          {activeTab === 'fields' ? (
            <FarmListPanel
              fields={fields}
              loading={fieldsQuery.loading}
              error={fieldsQuery.error}
              onViewReport={(fieldId) => {
                setSelectedFieldId(fieldId)
                setActiveTab('reports')
              }}
            />
          ) : null}
          {activeTab === 'reports' ? (
            <FieldReportPanel
              loading={fieldsQuery.loading}
              error={fieldsQuery.error}
              field={selectedField}
              onManageSubscription={isClientViewer ? undefined : () => setActiveTab('subscription')}
            />
          ) : null}
          {activeTab === 'advisory' ? <AdvisoryTab farmer={farmer} /> : null}
          {activeTab === 'subscription' && !isClientViewer ? (
            <SubscriptionTab farmer={farmer} onUpdated={handleSubscriptionUpdated} />
          ) : null}
          {activeTab === 'product_cards' && !isClientViewer ? (
            <ProductCardsTab farmer={farmer} />
          ) : null}
          {activeTab === 'profile' ? (
            <ProfilePanel
              farmer={farmer}
              canManageClients={canManageClients}
              onClientChange={(client) => setFarmer((prev) => (prev ? { ...prev, client } : prev))}
            />
          ) : null}
        </div>
      </section>
    </PageShell>
  )
}
