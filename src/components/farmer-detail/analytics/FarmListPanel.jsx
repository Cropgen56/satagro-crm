import clsx from 'clsx'
import { BarChart3, Sprout } from 'lucide-react'
import {
  formatEnumLabel,
  formatFieldDate,
  formatFieldVarieties,
  getFieldCrops,
  getFieldSowingDate,
} from '@/lib/farmAnalytics'

export default function FarmListPanel({ fields, loading, error, onViewReport }) {
  if (loading) {
    return <p className="py-12 text-center text-sm text-gray-500">Loading fields…</p>
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!fields.length) {
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
        <h3 className="text-sm font-semibold text-gray-900">Farm list ({fields.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3.5">#</th>
              <th className="px-5 py-3.5">Farm name</th>
              <th className="px-5 py-3.5">Crops</th>
              <th className="px-5 py-3.5">Area</th>
              <th className="px-5 py-3.5">Variety</th>
              <th className="px-5 py-3.5">Irrigation</th>
              <th className="px-5 py-3.5">Farming type</th>
              <th className="px-5 py-3.5">Sowing</th>
              <th className="px-5 py-3.5">Subscription</th>
              <th className="px-5 py-3.5">Plan</th>
              <th className="sticky right-0 bg-gray-50 px-5 py-3.5 text-center">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fields.map((field, i) => {
              const crops = getFieldCrops(field)
              const subscription = field.subscription || {}
              const active = Boolean(subscription.hasActiveSubscription)
              const statusLabel = active
                ? 'Active'
                : subscription.status === 'expired'
                  ? 'Expired'
                  : subscription.status === 'pending'
                    ? 'Pending'
                    : 'None'
              return (
                <tr key={field._id} className="text-sm text-gray-700">
                  <td className="px-5 py-4 text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">{field.fieldName || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {crops.length
                        ? crops.map((crop, j) => (
                            <span
                              key={crop._id || `${crop.cropName}-${j}`}
                              className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium capitalize text-brand-primary"
                            >
                              {crop.cropName}
                            </span>
                          ))
                        : '—'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {Number(field.acre) > 0 ? `${Number(field.acre).toFixed(2)} ac` : '—'}
                  </td>
                  <td className="px-5 py-4">{formatFieldVarieties(field)}</td>
                  <td className="px-5 py-4">{formatEnumLabel(field.typeOfIrrigation)}</td>
                  <td className="px-5 py-4">{formatEnumLabel(field.typeOfFarming)}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {formatFieldDate(getFieldSowingDate(field))}
                    {field.isBarrenLand ? (
                      <span className="block text-xs text-amber-600">Expected (barren)</span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={clsx(
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        active
                          ? 'bg-green-50 text-green-700'
                          : statusLabel === 'None'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-amber-50 text-amber-700',
                      )}
                    >
                      {statusLabel}
                    </span>
                    {active && subscription.daysLeft != null ? (
                      <span className="mt-1 block text-xs text-gray-500">
                        {subscription.daysLeft} days left
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">{subscription.plan?.name || '—'}</td>
                  <td className="sticky right-0 bg-white px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onViewReport(field._id)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-brand-primary/30 px-3 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-light"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      View Report
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
