import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import clsx from 'clsx'
import {
  ArrowLeft,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Sprout,
  Tractor,
} from 'lucide-react'
import PageTopBar from '@/components/layout/PageTopBar'
import FarmerDetailTabs from '@/components/farmer-detail/FarmerDetailTabs'
import SubscriptionTab from '@/components/farmer-detail/tabs/SubscriptionTab'
import ProductCardsTab from '@/components/farmer-detail/tabs/ProductCardsTab'
import AdvisoryTab from '@/components/farmer-detail/tabs/AdvisoryTab'
import StatusBadge from '@/components/farmers/StatusBadge'
import { UserAvatar } from '@/components/ui/EmptyState'
import RecordNotFoundPage from '@/pages/RecordNotFoundPage'
import { fetchFarmerById } from '@/lib/farmers'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatLocationParts(farmer) {
  return [farmer.village, farmer.district, farmer.state, farmer.country]
    .filter(Boolean)
    .join(', ')
}

function SummaryCard({ icon: Icon, label, value, note, iconBg, iconColor }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {note ? <p className="mt-1 text-xs text-gray-500">{note}</p> : null}
        </div>
        <span
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            iconBg,
          )}
        >
          <Icon className={clsx('h-5 w-5', iconColor)} />
        </span>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-50 py-3 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value || '—'}</dd>
    </div>
  )
}

function OverviewPanel({ farmer }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Contact & Account</h3>
        <dl className="mt-4">
          <InfoRow label="Phone" value={farmer.phone} />
          <InfoRow label="Email" value={farmer.email} />
          <InfoRow label="Language" value={farmer.language} />
          <InfoRow label="Client source" value={farmer.clientSource} />
          <InfoRow
            label="Terms accepted"
            value={farmer.termsAccepted ? 'Yes' : 'No'}
          />
          <InfoRow label="Joined" value={formatDate(farmer.createdAt)} />
          <InfoRow label="Last login" value={formatDate(farmer.lastLoginAt)} />
          <InfoRow label="Last active" value={farmer.lastAdvisory} />
        </dl>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Location</h3>
        <dl className="mt-4">
          <InfoRow label="Country" value={farmer.country} />
          <InfoRow label="State" value={farmer.state} />
          <InfoRow label="District" value={farmer.district} />
          <InfoRow label="City" value={farmer.city} />
          <InfoRow label="Village" value={farmer.village} />
        </dl>
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          {formatLocationParts(farmer) || farmer.location || 'No location added'}
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-900">Farm Summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[#F7FAF9] px-4 py-3">
            <p className="text-xs text-gray-500">Total farms added</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {farmer.fieldCount}
            </p>
          </div>
          <div className="rounded-lg bg-[#F7FAF9] px-4 py-3">
            <p className="text-xs text-gray-500">Total acreage</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {farmer.totalAcre > 0 ? `${farmer.totalAcre.toFixed(1)} ac` : '—'}
            </p>
          </div>
          <div className="rounded-lg bg-[#F7FAF9] px-4 py-3">
            <p className="text-xs text-gray-500">Crops</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {farmer.crops?.length ? farmer.crops.join(', ') : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldsPanel({ farmer }) {
  if (!farmer.fields?.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
        <Sprout className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-700">No farms added yet</p>
        <p className="mt-1 text-sm text-gray-500">
          This farmer has not registered any farm plots in the app.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Farms added ({farmer.fields.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3.5">Farm name</th>
              <th className="px-5 py-3.5">Crop</th>
              <th className="px-5 py-3.5">Variety</th>
              <th className="px-5 py-3.5">Area</th>
              <th className="px-5 py-3.5">Sowing</th>
              <th className="px-5 py-3.5">Irrigation</th>
              <th className="px-5 py-3.5">Farming type</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {farmer.fields.map((field) => (
              <tr key={field.id} className="text-sm text-gray-700">
                <td className="px-5 py-4 font-medium text-gray-900">
                  {field.fieldName}
                </td>
                <td className="px-5 py-4">{field.cropName}</td>
                <td className="px-5 py-4">{field.variety}</td>
                <td className="px-5 py-4">
                  {field.acre > 0 ? `${field.acre.toFixed(1)} ac` : '—'}
                </td>
                <td className="px-5 py-4">{field.sowingDate}</td>
                <td className="px-5 py-4">{field.typeOfIrrigation}</td>
                <td className="px-5 py-4">{field.typeOfFarming}</td>
                <td className="px-5 py-4">
                  <span
                    className={clsx(
                      'rounded-full px-2.5 py-1 text-xs font-medium',
                      field.isBarrenLand
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-green-50 text-green-700',
                    )}
                  >
                    {field.isBarrenLand ? 'Barren land' : 'Active crop'}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {formatDate(field.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PlaceholderPanel({ title }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="mt-1 text-sm text-gray-500">This section will be available soon.</p>
    </div>
  )
}

export default function FarmerDetailPage() {
  const { id } = useParams()
  const [farmer, setFarmer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

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

  if (loading) {
    return (
      <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
        <PageTopBar />
        <div className="mx-auto mt-8 max-w-[1400px] text-sm text-gray-500">
          Loading farmer profile...
        </div>
      </div>
    )
  }

  if (!farmer) {
    return <RecordNotFoundPage backTo="/farmers" label="Farmer" />
  }

  const summaryCards = [
    {
      icon: Tractor,
      label: 'Farms added',
      value: farmer.fieldCount,
      note: 'Registered plots',
      iconBg: 'bg-[#E7EFEC]',
      iconColor: 'text-brand-primary',
    },
    {
      icon: Sprout,
      label: 'Total acreage',
      value: farmer.totalAcre > 0 ? `${farmer.totalAcre.toFixed(1)} ac` : '—',
      note: 'Across all farms',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-700',
    },
    {
      icon: Globe,
      label: 'Crops',
      value: farmer.crops?.length || 0,
      note: farmer.crops?.length ? farmer.crops.join(', ') : 'No crops yet',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Calendar,
      label: 'Last active',
      value: farmer.lastAdvisory,
      note: formatDate(farmer.lastActiveAt),
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    },
  ]

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mx-auto mt-6 max-w-[1400px] space-y-6">
        <Link
          to="/farmers"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to farmers
        </Link>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <UserAvatar
                name={farmer.name}
                avatar={farmer.avatar}
                className="h-20 w-20 shrink-0 text-lg"
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{farmer.name}</h1>
                  <StatusBadge status={farmer.status} />
                </div>
                <p className="mt-1 text-sm text-gray-500">{farmer.uid}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {farmer.phone}
                  </span>
                  {farmer.email ? (
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {farmer.email}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {formatLocationParts(farmer) || farmer.location || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <FarmerDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === 'overview' ? <OverviewPanel farmer={farmer} /> : null}
            {activeTab === 'fields' ? <FieldsPanel farmer={farmer} /> : null}
            {activeTab === 'subscription' ? (
              <SubscriptionTab farmer={farmer} onUpdated={loadFarmer} />
            ) : null}
            {activeTab === 'product_cards' ? (
              <ProductCardsTab farmer={farmer} />
            ) : null}
            {activeTab === 'advisory' ? (
              <AdvisoryTab farmer={farmer} />
            ) : null}
            {activeTab === 'activity' ? (
              <PlaceholderPanel title="Activity history" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
