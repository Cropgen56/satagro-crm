import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Leaf,
  Sprout,
  AlertTriangle,
  CloudSun,
  Search,
} from 'lucide-react'
import { fetchFarmerAdvisories } from '@/lib/advisories'

const ACTIVITY_STYLES = {
  SPRAY: { bg: 'bg-violet-50', text: 'text-violet-700', icon: Droplets },
  FERTIGATION: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Sprout },
  IRRIGATION: { bg: 'bg-sky-50', text: 'text-sky-700', icon: Droplets },
  WEATHER: { bg: 'bg-amber-50', text: 'text-amber-700', icon: CloudSun },
  CROP_RISK: { bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertTriangle },
  MONITORING: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: Search },
  CARBON_TRACKING: { bg: 'bg-green-50', text: 'text-green-700', icon: Leaf },
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ActivityCard({ activity }) {
  const style = ACTIVITY_STYLES[activity.type] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: Leaf,
  }
  const Icon = style.icon

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <div className="flex items-start gap-3">
        <span
          className={clsx(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            style.bg,
          )}
        >
          <Icon className={clsx('h-4 w-4', style.text)} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
            <span
              className={clsx(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                style.bg,
                style.text,
              )}
            >
              {activity.type.replace(/_/g, ' ')}
            </span>
            {activity.progress ? (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium capitalize text-gray-600">
                {activity.progress.replace(/_/g, ' ')}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            {activity.message}
          </p>
        </div>
      </div>
    </div>
  )
}

function AdvisoryCard({ advisory }) {
  const [expanded, setExpanded] = useState(false)
  const previewActivities = advisory.activities.slice(0, 2)
  const hiddenCount = Math.max(0, advisory.activities.length - previewActivities.length)

  return (
    <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {formatDate(advisory.createdAt)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {advisory.activitiesCount} activit
            {advisory.activitiesCount === 1 ? 'y' : 'ies'}
            {advisory.activitiesSource
              ? ` · ${advisory.activitiesSource}`
              : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {advisory.cropHealth?.category ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              Health: {advisory.cropHealth.category}
              {advisory.cropHealth.score != null
                ? ` (${advisory.cropHealth.score})`
                : ''}
            </span>
          ) : null}
          {advisory.growthStage?.label ? (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {advisory.growthStage.label}
            </span>
          ) : null}
          {advisory.yield?.aiYield != null ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              Yield: {advisory.yield.aiYield} {advisory.yield.unit}
            </span>
          ) : null}
        </div>
      </div>

      {advisory.cropHealth?.recommendation ? (
        <p className="mt-3 text-sm text-gray-600">
          {advisory.cropHealth.recommendation}
        </p>
      ) : null}

      <div className="mt-3 space-y-2">
        {(expanded ? advisory.activities : previewActivities).map((activity, idx) => (
          <ActivityCard key={`${activity.type}-${idx}`} activity={activity} />
        ))}
      </div>

      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Show {hiddenCount} more activit{hiddenCount === 1 ? 'y' : 'ies'}{' '}
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      ) : null}
    </div>
  )
}

function FieldAdvisorySection({ group, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50/60"
      >
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {group.field.fieldName}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {group.field.cropName}
            {group.field.variety && group.field.variety !== '—'
              ? ` · ${group.field.variety}`
              : ''}
            {group.field.acre > 0 ? ` · ${group.field.acre.toFixed(2)} ac` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
            {group.total} advisories
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {open ? (
        <div className="space-y-3 border-t border-gray-100 px-5 py-4">
          {group.advisories.length ? (
            group.advisories.map((advisory) => (
              <AdvisoryCard key={advisory.id} advisory={advisory} />
            ))
          ) : (
            <p className="py-6 text-center text-sm text-gray-500">
              No advisories generated for this field yet.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default function AdvisoryTab({ farmer }) {
  const [groups, setGroups] = useState([])
  const [totalAdvisories, setTotalAdvisories] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fieldFilter, setFieldFilter] = useState('')

  const load = useCallback(async () => {
    if (!farmer?.id) return
    try {
      setLoading(true)
      setError('')
      const res = await fetchFarmerAdvisories(farmer.id, {
        ...(fieldFilter ? { fieldId: fieldFilter } : {}),
        limitPerField: 20,
      })
      setGroups(res?.data?.fields || [])
      setTotalAdvisories(res?.data?.totalAdvisories || 0)
    } catch (err) {
      setError(err.message || 'Failed to load advisories')
      setGroups([])
      setTotalAdvisories(0)
    } finally {
      setLoading(false)
    }
  }, [farmer?.id, fieldFilter])

  useEffect(() => {
    load()
  }, [load])

  const fieldOptions = useMemo(
    () => farmer?.fields || [],
    [farmer?.fields],
  )

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center text-sm text-gray-500 shadow-sm">
        Loading advisories...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Total advisories
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalAdvisories}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Fields with data
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {groups.filter((g) => g.total > 0).length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Farms registered
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {farmer.fieldCount || fieldOptions.length}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {fieldOptions.length > 1 ? (
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by field</label>
          <select
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
          >
            <option value="">All fields</option>
            {fieldOptions.map((field) => (
              <option key={field.id} value={field.id}>
                {field.fieldName}
                {field.acre > 0 ? ` (${field.acre.toFixed(2)} ac)` : ''}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {!groups.length ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <Leaf className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-700">No advisories yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Advisories appear here after fields are added and the advisory pipeline runs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group, index) => (
            <FieldAdvisorySection
              key={group.field.id}
              group={group}
              defaultOpen={index === 0 || Boolean(fieldFilter)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
