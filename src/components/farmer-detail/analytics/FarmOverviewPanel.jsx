import { useMemo } from 'react'
import clsx from 'clsx'
import { Activity, AlertTriangle, Clock, CreditCard } from 'lucide-react'
import useAsyncData from '@/hooks/useAsyncData'
import { fetchFarmerAdvisories } from '@/lib/advisories'
import FieldSatelliteMap from '@/components/farmer-detail/analytics/FieldSatelliteMap'
import { formatFieldCrops, healthTone, timeAgo } from '@/lib/farmAnalytics'

const ALERT_WINDOW_DAYS = 5

function isRiskActivity(type) {
  const t = String(type || '').toUpperCase()
  return t === 'CROP_RISK' || t.includes('RISK')
}

function MetricCard({ icon: Icon, label, value, note, iconBg, iconColor, noteClass }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {note ? (
            <p className={clsx('mt-1 text-xs', noteClass || 'text-gray-500')}>{note}</p>
          ) : null}
        </div>
        <span className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
          <Icon className={clsx('h-5 w-5', iconColor)} />
        </span>
      </div>
    </div>
  )
}

function summarize(groups) {
  const cutoff = Date.now() - ALERT_WINDOW_DAYS * 86400000
  const alerts = []
  let lastCoverage = null

  const health = groups.map(({ field, advisories }) => {
    advisories.forEach((advisory) => {
      const created = advisory.createdAt ? new Date(advisory.createdAt).getTime() : NaN
      if (!Number.isFinite(created)) return
      if (!lastCoverage || created > lastCoverage) lastCoverage = created
      if (created < cutoff) return
      advisory.activities.forEach((activity, i) => {
        if (!isRiskActivity(activity.type)) return
        alerts.push({
          id: `${advisory.id}-${i}`,
          title: activity.title || 'Crop risk',
          message: activity.message || '',
          createdAt: advisory.createdAt,
          fieldName: field.fieldName,
          cropName: field.cropName,
        })
      })
    })

    const percentage = advisories[0]?.cropHealth?.percentage
    return {
      id: field.id,
      fieldName: field.fieldName,
      cropName: field.cropName,
      percentage:
        Number.isFinite(Number(percentage)) && percentage !== null
          ? Math.round(Number(percentage))
          : null,
    }
  })

  alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const scored = health.filter((h) => h.percentage != null)
  const avgHealth = scored.length
    ? Math.round(scored.reduce((sum, h) => sum + h.percentage, 0) / scored.length)
    : null

  return { alerts, health, avgHealth, scoredCount: scored.length, lastCoverage }
}

export default function FarmOverviewPanel({
  farmer,
  fields,
  selectedField: mapField,
  fieldsLoading,
  fieldsError,
}) {
  const advisoriesQuery = useAsyncData(`overview:${farmer.id}`, () =>
    fetchFarmerAdvisories(farmer.id, { limitPerField: 10 }),
  )
  const groups = useMemo(() => advisoriesQuery.data?.data?.fields || [], [advisoriesQuery.data])
  const { alerts, health, avgHealth, scoredCount, lastCoverage } = useMemo(
    () => summarize(groups),
    [groups],
  )

  const loadingAdvisories = advisoriesQuery.loading
  const subscribedCount = fields.filter((f) => f.subscription?.hasActiveSubscription).length
  const avgTone = healthTone(avgHealth)

  return (
    <div className="space-y-6">
      {advisoriesQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {advisoriesQuery.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Avg crop health"
          value={loadingAdvisories ? '…' : avgHealth != null ? `${avgHealth}%` : '—'}
          note={
            loadingAdvisories
              ? 'Loading advisories'
              : avgHealth != null
                ? `${avgTone.label} · ${scoredCount} field${scoredCount === 1 ? '' : 's'} scored`
                : 'No health score yet'
          }
          noteClass={avgHealth != null ? avgTone.text : undefined}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Active alerts"
          value={loadingAdvisories ? '…' : alerts.length}
          note={`Crop risks in the last ${ALERT_WINDOW_DAYS} days`}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <MetricCard
          icon={Clock}
          label="Last advisory"
          value={loadingAdvisories ? '…' : timeAgo(lastCoverage) || '—'}
          note={lastCoverage ? 'Latest advisory generated' : 'No advisory generated yet'}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <MetricCard
          icon={CreditCard}
          label="Subscribed farms"
          value={fieldsLoading ? '…' : `${subscribedCount} / ${fields.length}`}
          note={
            fieldsLoading
              ? 'Loading farms'
              : fields.length && subscribedCount === fields.length
                ? 'All farms covered'
                : `${fields.length - subscribedCount} without an active plan`
          }
          noteClass={
            !fieldsLoading && fields.length && subscribedCount < fields.length
              ? 'text-amber-700'
              : undefined
          }
          iconBg="bg-[#E7EFEC]"
          iconColor="text-brand-primary"
        />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Satellite view</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {mapField
                ? `Satellite index overlay for ${mapField.fieldName} · ${formatFieldCrops(mapField)}`
                : 'Satellite index overlay for the selected farm'}
            </p>
          </div>
        </div>
        <div className="p-5">
          {fieldsLoading ? (
            <p className="py-10 text-center text-sm text-gray-500">Loading field boundaries…</p>
          ) : fieldsError ? (
            <p className="py-10 text-center text-sm text-red-600">{fieldsError}</p>
          ) : mapField ? (
            <FieldSatelliteMap key={mapField._id} field={mapField} />
          ) : (
            <p className="py-10 text-center text-sm text-gray-500">
              This farmer has not added any fields yet.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">Recent alerts</h3>
          <div className="mt-4 space-y-3">
            {loadingAdvisories ? (
              <p className="text-sm text-gray-500">Loading alerts…</p>
            ) : alerts.length ? (
              alerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className="flex gap-3 rounded-lg border border-orange-100 bg-orange-50/50 p-3"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      <span className="shrink-0 text-xs text-gray-500">
                        {timeAgo(alert.createdAt)}
                      </span>
                    </div>
                    {alert.message ? (
                      <p className="mt-0.5 text-sm text-gray-600">{alert.message}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-gray-500">
                      {alert.fieldName}
                      {alert.cropName && alert.cropName !== '—' ? ` · ${alert.cropName}` : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No crop-risk alerts in the last {ALERT_WINDOW_DAYS} days.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">Crop health by farm</h3>
          <ul className="mt-4 space-y-3">
            {loadingAdvisories ? (
              <li className="text-sm text-gray-500">Loading health scores…</li>
            ) : health.length ? (
              health.map((item) => {
                const tone = healthTone(item.percentage)
                return (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    <span className="w-2/5 truncate font-medium text-gray-800">
                      {item.fieldName}
                      {item.cropName && item.cropName !== '—' ? ` · ${item.cropName}` : ''}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={clsx('h-full rounded-full', tone.bar)}
                        style={{
                          width: `${item.percentage != null ? Math.min(100, Math.max(0, item.percentage)) : 0}%`,
                        }}
                      />
                    </div>
                    <span className={clsx('w-12 text-right font-semibold', tone.text)}>
                      {item.percentage != null ? `${item.percentage}%` : 'N/A'}
                    </span>
                  </li>
                )
              })
            ) : (
              <li className="text-sm text-gray-500">No fields available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
