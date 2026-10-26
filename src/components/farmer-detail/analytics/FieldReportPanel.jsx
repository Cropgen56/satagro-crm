import clsx from 'clsx'
import { CreditCard, Sprout } from 'lucide-react'
import useAsyncData from '@/hooks/useAsyncData'
import FieldSatelliteMap from '@/components/farmer-detail/analytics/FieldSatelliteMap'
import IndexTimeSeriesCard from '@/components/farmer-detail/analytics/IndexTimeSeriesCard'
import {
  EvapotranspirationCard,
  FarmHealthCard,
  PlantGrowthCard,
  SmartAdvisoryCard,
  SoilAnalysisCard,
} from '@/components/farmer-detail/analytics/ReportSections'
import {
  fetchFieldForecast,
  fetchLatestFieldAdvisory,
  formatFieldCrops,
  hasBoundary,
  toRing,
} from '@/lib/farmAnalytics'

const VEGETATION_INDICES = [
  ['NDVI', 'NDVI tracks canopy greenness and vegetation cover changes over time.'],
  ['EVI', 'EVI is more sensitive in dense canopies where NDVI saturates.'],
  ['SAVI', 'SAVI corrects for bare-soil brightness in early or sparse crops.'],
  ['SUCROSE', 'Sucrose index estimates sugar accumulation in the crop canopy.'],
]

const WATER_INDICES = [
  ['NDMI', 'NDMI monitors vegetation water content and drought stress.'],
  ['NDWI', 'NDWI indicates water presence in vegetation and irrigation zones.'],
  ['SMI', 'SMI tracks surface soil moisture for irrigation planning.'],
  ['MSI', 'MSI rises with water stress; higher values mean drier vegetation.'],
  ['WI', 'WI highlights moisture content in crops over time.'],
  ['NMDI', 'NMDI detects moisture variation in soil and vegetation under dry spells.'],
]

export default function FieldReportPanel({ loading, error, field, onManageSubscription }) {
  const fieldId = field?._id
  const mapped = hasBoundary(field)

  const advisoryQuery = useAsyncData(fieldId ? `advisory:${fieldId}` : null, () =>
    fetchLatestFieldAdvisory(fieldId),
  )
  const forecastQuery = useAsyncData(mapped ? `forecast:${fieldId}` : null, (signal) =>
    fetchFieldForecast(fieldId, toRing(field.field), { signal }),
  )

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
  if (!field) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
        <Sprout className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-700">No farm data found</p>
        <p className="mt-1 text-sm text-gray-500">
          This farmer does not have any fields mapped yet.
        </p>
      </div>
    )
  }

  const subscription = field.subscription || {}
  const active = Boolean(subscription.hasActiveSubscription)
  const forecastError = mapped
    ? forecastQuery.error
    : 'This field has no mapped boundary, so weather data is unavailable.'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Report · {field.fieldName}</h3>
          <p className="text-sm text-gray-500">
            {formatFieldCrops(field)}
            <span
              className={clsx(
                'ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
              )}
            >
              <span
                className={clsx('h-1.5 w-1.5 rounded-full', active ? 'bg-green-500' : 'bg-red-500')}
              />
              {active ? subscription.plan?.name || 'Subscribed' : 'No active subscription'}
            </span>
          </p>
        </div>
        {onManageSubscription ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onManageSubscription}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:bg-brand-950"
            >
              <CreditCard className="h-4 w-4" />
              {active ? 'Manage subscription' : 'Activate subscription'}
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <FieldSatelliteMap key={field._id} field={field} heightClass="h-[420px] lg:h-[500px]" />
      </div>

      <FarmHealthCard
        field={field}
        advisory={advisoryQuery.data}
        loading={advisoryQuery.loading}
        error={advisoryQuery.error}
      />

      <SoilAnalysisCard
        advisory={advisoryQuery.data}
        advisoryLoading={advisoryQuery.loading}
        advisoryError={advisoryQuery.error}
        forecast={forecastQuery.data}
        forecastLoading={forecastQuery.loading}
        forecastError={forecastError}
      />

      {mapped ? (
        <>
          <IndexTimeSeriesCard
            key={`veg-${field._id}`}
            field={field}
            family="vegetation"
            title="Vegetation Index"
            options={VEGETATION_INDICES}
            color="#22c55e"
          />
          <IndexTimeSeriesCard
            key={`water-${field._id}`}
            field={field}
            family="water"
            title="Water Index"
            options={WATER_INDICES}
            color="#38bdf8"
          />
        </>
      ) : null}

      <EvapotranspirationCard
        forecast={forecastQuery.data}
        loading={forecastQuery.loading}
        error={forecastError}
      />

      <SmartAdvisoryCard
        advisory={advisoryQuery.data}
        loading={advisoryQuery.loading}
        error={advisoryQuery.error}
      />

      <PlantGrowthCard
        field={field}
        advisory={advisoryQuery.data}
        loading={advisoryQuery.loading}
      />
    </div>
  )
}
