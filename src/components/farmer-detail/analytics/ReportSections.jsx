import clsx from 'clsx'
import { Droplets, Loader2, Sprout, Thermometer } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  daysSince,
  formatEnumLabel,
  formatFieldCrops,
  formatFieldDate,
  formatFieldVarieties,
  getFieldSowingDate,
  healthTone,
} from '@/lib/farmAnalytics'

const cardClass = 'rounded-xl border border-gray-100 bg-white p-6 shadow-sm'

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function CardState({ loading, error, empty, children }) {
  if (loading) {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </p>
    )
  }
  if (error) return <p className="py-6 text-sm text-red-600">{error}</p>
  if (empty) return <p className="py-6 text-sm text-gray-500">{empty}</p>
  return children
}

function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-gray-900">{value ?? '—'}</dd>
    </div>
  )
}

export function FarmHealthCard({ field, advisory, loading, error }) {
  const sowing = getFieldSowingDate(field)
  const age = field.isBarrenLand ? null : daysSince(sowing)
  const health = advisory?.cropHealth
  const percentage = toNumber(health?.percentage)
  const tone = healthTone(percentage)
  const yieldUnit = advisory?.yield?.unit || ''
  const standardYield = toNumber(advisory?.yield?.standardYield)
  const aiYield = toNumber(advisory?.yield?.aiYield)

  return (
    <div className={cardClass}>
      <h3 className="text-sm font-semibold text-gray-900">Farm Health</h3>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <InfoItem label="Field name" value={field.fieldName} />
        <InfoItem label="Crop" value={formatFieldCrops(field)} />
        <InfoItem label="Variety" value={formatFieldVarieties(field)} />
        <InfoItem
          label="Total area"
          value={Number(field.acre) > 0 ? `${Number(field.acre).toFixed(2)} ac` : '—'}
        />
        <InfoItem label="Farming type" value={formatEnumLabel(field.typeOfFarming)} />
        <InfoItem label="Irrigation" value={formatEnumLabel(field.typeOfIrrigation)} />
        <InfoItem
          label={field.isBarrenLand ? 'Expected sowing' : 'Sowing date'}
          value={formatFieldDate(sowing)}
        />
        <InfoItem
          label="Crop age"
          value={field.isBarrenLand ? 'Not sown' : age != null && age >= 0 ? `${age} days` : '—'}
        />
        <InfoItem
          label="Standard yield"
          value={loading ? '…' : standardYield != null ? `${standardYield} ${yieldUnit}` : 'N/A'}
        />
        <InfoItem
          label="AI yield"
          value={loading ? '…' : aiYield != null ? `${aiYield} ${yieldUnit}` : 'N/A'}
        />
      </dl>

      <div className="mt-6 border-t border-gray-100 pt-5">
        <CardState
          loading={loading}
          error={error}
          empty={
            percentage == null
              ? 'No crop health score has been generated for this field yet.'
              : null
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-semibold text-gray-800">Overall crop health</span>
              <span className={clsx('text-2xl font-bold', tone.text)}>
                {Math.round(percentage)}%
              </span>
            </div>
            <span
              className={clsx(
                'rounded-full px-3 py-1 text-xs font-semibold',
                tone.text,
                'bg-gray-50',
              )}
            >
              {health?.category || tone.label}
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className={clsx('h-full rounded-full', tone.bar)}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
          {health?.recommendation ? (
            <p className="mt-3 rounded-lg bg-sky-50 p-3 text-sm text-gray-700">
              {health.recommendation}
            </p>
          ) : null}
          {advisory?.createdAt ? (
            <p className="mt-2 text-xs text-gray-400">
              From advisory generated {formatFieldDate(advisory.createdAt)}
            </p>
          ) : null}
        </CardState>
      </div>
    </div>
  )
}

const NUTRIENTS = [
  ['N', 'Nitrogen', 'nitrogenKgPerHa'],
  ['P', 'Phosphorous', 'phosphorousKgPerHa'],
  ['K', 'Potassium', 'potassiumKgPerHa'],
]

function formatSoilValue(value, unit) {
  const n = toNumber(value)
  return n == null ? '—' : `${n}${unit}`
}

export function SoilAnalysisCard({
  advisory,
  advisoryLoading,
  advisoryError,
  forecast,
  forecastLoading,
  forecastError,
}) {
  const npk = advisory?.npkManagement
  const hasNpk =
    npk &&
    NUTRIENTS.some(
      ([, , key]) =>
        toNumber(npk.available?.[key]) != null || toNumber(npk.required?.[key]) != null,
    )
  const current = forecast?.current
  const layers = [
    ['Surface', current?.soil_temperature_surface, current?.soil_moisture_surface],
    ['Subsoil (5 cm)', current?.soil_temperature_5cm, current?.soil_moisture_5cm],
    ['Parent material (15 cm)', current?.soil_temperature_15cm, current?.soil_moisture_15cm],
  ]
  const hasSoil = layers.some(([, t, m]) => toNumber(t) != null || toNumber(m) != null)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Soil Analysis (NPK)</h3>
          {hasNpk ? (
            <div className="flex gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#36A534]" /> Available
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#C4E930]" /> Required
              </span>
            </div>
          ) : null}
        </div>
        <CardState
          loading={advisoryLoading}
          error={advisoryError}
          empty={hasNpk ? null : 'NPK data is not available for this field yet.'}
        >
          <div className="mt-4 space-y-3">
            {NUTRIENTS.map(([symbol, label, key]) => {
              const available = toNumber(npk?.available?.[key])
              const required = toNumber(npk?.required?.[key])
              const max = Math.max(available || 0, required || 0, 1)
              return (
                <div
                  key={symbol}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-500 text-xs font-bold text-white">
                    {symbol}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#36A534]"
                        style={{ width: `${((available || 0) / max) * 100}%` }}
                      />
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#C4E930]"
                        style={{ width: `${((required || 0) / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-gray-900">
                      {available != null ? `${available} kg/ha` : '—'}
                    </p>
                    <p className="text-gray-500">{required != null ? `${required} kg/ha` : '—'}</p>
                  </div>
                </div>
              )
            })}
            {npk?.recommendation ? (
              <p className="rounded-lg bg-sky-50 p-3 text-sm text-gray-700">
                <span className="font-semibold">Recommendation: </span>
                {npk.recommendation}
              </p>
            ) : null}
          </div>
        </CardState>
      </div>

      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-gray-900">Soil Health</h3>
        <CardState
          loading={forecastLoading}
          error={forecastError}
          empty={hasSoil ? null : 'Current soil readings are not available for this field.'}
        >
          <div className="mt-4 space-y-3">
            {layers.map(([label, temp, moisture]) => (
              <div
                key={label}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <div className="flex gap-5 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-gray-700">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    {formatSoilValue(temp, '°C')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-gray-700">
                    <Droplets className="h-4 w-4 text-sky-500" />
                    {formatSoilValue(moisture, ' m³/m³')}
                  </span>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400">
              Current conditions from the weather model for this field.
            </p>
          </div>
        </CardState>
      </div>
    </div>
  )
}

export function EvapotranspirationCard({ forecast, loading, error }) {
  const times = forecast?.forecast?.time || []
  const values = forecast?.forecast?.evapotranspiration || []
  const points = times
    .map((date, i) => ({ date: String(date).slice(0, 10), value: toNumber(values[i]) }))
    .filter((p) => p.date && p.value != null)

  const max = points.length ? points.reduce((a, b) => (b.value > a.value ? b : a)) : null
  const avg = points.length ? points.reduce((s, p) => s + p.value, 0) / points.length : null

  return (
    <div className={cardClass}>
      <h3 className="text-sm font-semibold text-gray-900">Evapotranspiration</h3>
      <CardState
        loading={loading}
        error={error}
        empty={points.length ? null : 'No evapotranspiration forecast is available for this field.'}
      >
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">ET high</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{max?.value.toFixed(2)} mm</p>
              <p className="text-xs text-gray-500">{max ? formatFieldDate(max.date) : ''}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">ET average</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{avg?.toFixed(2)} mm</p>
              <p className="text-xs text-gray-500">{points.length}-day forecast</p>
            </div>
          </div>
          <div className="h-[220px] lg:col-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  minTickGap={16}
                />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} unit=" mm" width={56} />
                <Tooltip
                  labelFormatter={(d) => formatFieldDate(d)}
                  formatter={(v) => [`${Number(v).toFixed(2)} mm`, 'Daily ET']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 2.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardState>
    </div>
  )
}

const PROTECTION_GROUPS = [
  ['disease', 'Disease & crop risk'],
  ['pest', 'Pest'],
  ['spray', 'Spray'],
  ['fertigation', 'Fertigation'],
  ['micronutrient', 'Monitoring & micronutrients'],
]

function buildSmartView(advisory) {
  if (!advisory) return null
  const stored = advisory.smartAdvisory
  if (stored && typeof stored === 'object') {
    return {
      items: (stored.weeklyAdvisory?.items || []).map((item) => ({
        type: item.key,
        text: item.advice,
        confidence: toNumber(item.confidence),
      })),
      irrigation: stored.irrigationStage
        ? {
            percentage: toNumber(stored.irrigationStage.irrigationPercentage),
            recommendations: stored.irrigationStage.recommendations || [],
          }
        : null,
      protection: stored.nutrientManagement || null,
    }
  }

  const activities = Array.isArray(advisory.activitiesToDo) ? advisory.activitiesToDo : []
  const byType = (type) => activities.filter((a) => String(a?.type || '').toUpperCase() === type)
  const messages = (type) =>
    byType(type)
      .map((a) => a.message || a.title)
      .filter(Boolean)

  const irrigationActs = byType('IRRIGATION')
  const irrigationPercentage = irrigationActs
    .map((a) => toNumber(a?.details?.irrigationPercentage ?? a?.details?.percentage))
    .find((n) => n != null)

  const risks = messages('CROP_RISK')
  const pestPattern = /pest|insect/i
  const protection = {
    disease: risks.filter((t) => !pestPattern.test(t)),
    pest: risks.filter((t) => pestPattern.test(t)),
    spray: messages('SPRAY'),
    fertigation: messages('FERTIGATION'),
    micronutrient: messages('MONITORING'),
    recommendationNote: advisory.npkManagement?.recommendation || '',
  }

  return {
    items: activities
      .map((a) => ({
        type: String(a?.type || 'advice')
          .replace(/_/g, ' ')
          .toLowerCase(),
        text: [a?.title, a?.message].filter(Boolean).join(' — '),
        confidence: toNumber(a?.details?.confidence),
      }))
      .filter((item) => item.text),
    irrigation: irrigationActs.length
      ? {
          percentage: irrigationPercentage ?? null,
          recommendations: irrigationActs.map((a) => ({
            when: a.title || 'Irrigation',
            action: a.message || '',
            quantity: a.details?.quantity ?? a.details?.waterRequired ?? a.details?.amount ?? '',
            unit: a.details?.unit || '',
            rationale: a.details?.rationale || a.details?.reason || '',
          })),
        }
      : null,
    protection,
  }
}

export function SmartAdvisoryCard({ advisory, loading, error }) {
  const view = buildSmartView(advisory)
  const hasProtection =
    view?.protection &&
    (PROTECTION_GROUPS.some(([key]) => view.protection[key]?.length) ||
      view.protection.recommendationNote)
  const isEmpty = !view || (!view.items.length && !view.irrigation && !hasProtection)

  return (
    <div className={cardClass}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">Smart Advisory</h3>
        {advisory?.createdAt ? (
          <span className="text-xs text-gray-500">
            Generated {formatFieldDate(advisory.createdAt)}
          </span>
        ) : null}
      </div>
      <CardState
        loading={loading}
        error={error}
        empty={isEmpty ? 'No advisory has been generated for this field yet.' : null}
      >
        <div className="mt-4 space-y-6">
          {view?.items.length ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Recommendations
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {view.items.map((item, i) => (
                  <div key={i} className="rounded-lg border border-green-100 bg-green-50/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold capitalize text-brand-primary">
                        {item.type}
                      </p>
                      {item.confidence != null ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                          {Math.round(
                            item.confidence <= 1 ? item.confidence * 100 : item.confidence,
                          )}
                          % confidence
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {view?.irrigation ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Irrigation
                {view.irrigation.percentage != null
                  ? ` · ${Math.round(view.irrigation.percentage)}% of requirement`
                  : ''}
              </p>
              {view.irrigation.percentage != null ? (
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-sky-100">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${Math.min(100, Math.max(0, view.irrigation.percentage))}%` }}
                  />
                </div>
              ) : null}
              <div className="grid gap-3 md:grid-cols-2">
                {view.irrigation.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg border border-sky-100 bg-sky-50/50 p-4">
                    <p className="text-sm font-semibold text-gray-900">{rec.when}</p>
                    {rec.action ? <p className="mt-1 text-sm text-gray-700">{rec.action}</p> : null}
                    {rec.quantity !== '' && rec.quantity != null ? (
                      <p className="mt-1 text-sm">
                        <span className="text-gray-500">Water required: </span>
                        <span className="font-semibold text-sky-700">
                          {rec.quantity} {rec.unit}
                        </span>
                      </p>
                    ) : null}
                    {rec.rationale ? (
                      <p className="mt-1 text-xs text-gray-500">{rec.rationale}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {hasProtection ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Nutrient & crop protection
              </p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {PROTECTION_GROUPS.map(([key, label]) => {
                  const list = view.protection[key] || []
                  return (
                    <div key={key} className="rounded-lg border border-gray-100 p-4">
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      {list.length ? (
                        <ul className="mt-1.5 space-y-1 text-sm text-gray-700">
                          {list.map((text, i) => (
                            <li key={i}>• {text}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1.5 text-sm text-gray-400">No action required</p>
                      )}
                    </div>
                  )
                })}
              </div>
              {view.protection.recommendationNote ? (
                <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                  {view.protection.recommendationNote}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardState>
    </div>
  )
}

const CROP_CYCLE_WEEKS = {
  barley: 12,
  wheat: 14,
  pearlmillet: 10,
  sorghum: 12,
  fingermillet: 12,
  chickpea: 14,
  redgram: 20,
  greengram: 10,
  blackgram: 10,
  lentil: 14,
  fieldpea: 14,
  horsegram: 12,
  cowpea: 12,
  groundnut: 14,
  mustard: 14,
  soybean: 14,
  sunflower: 12,
  sesame: 12,
  linseed: 14,
  castor: 20,
  safflower: 14,
  niger: 12,
  sugarcane: 40,
  cotton: 20,
  jute: 16,
  tobacco: 16,
  potato: 12,
  tomato: 12,
  brinjal: 12,
  cabbage: 12,
  cauliflower: 12,
  onion: 16,
  garlic: 16,
  okra: 10,
  carrot: 12,
  radish: 6,
  spinach: 6,
  methi: 6,
  greenpeas: 10,
  bittergourd: 10,
  bottlegourd: 10,
  pumpkin: 12,
  cucumber: 8,
  beans: 8,
  mango: 52,
  banana: 40,
  guava: 52,
  apple: 52,
  papaya: 40,
  orange: 52,
  lemon: 52,
  pomegranate: 52,
  grapes: 52,
  pineapple: 52,
  watermelon: 10,
  muskmelon: 10,
  turmeric: 32,
  ginger: 32,
  coriander: 6,
  cumin: 12,
  blackpepper: 52,
  redchilies: 12,
  tea: 52,
  coffee: 52,
  coconut: 52,
  arecanut: 52,
  rubber: 52,
  dragonfruit: 52,
  spongegourd: 10,
  snakegourd: 10,
  ashgourd: 12,
  drumstick: 52,
  chili: 12,
  chia: 12,
  rice: 16,
  kiwi: 52,
  amla: 52,
  capsicum: 12,
}

export function PlantGrowthCard({ field, advisory, loading }) {
  const sowing = getFieldSowingDate(field)
  const days = field.isBarrenLand ? null : daysSince(sowing)
  const cropKey = String(field.cropName || '')
    .toLowerCase()
    .replace(/[\s_-]/g, '')
  const cycleWeeks = CROP_CYCLE_WEEKS[cropKey] || null
  const growth = advisory?.plantGrowthActivity || {}
  const stage = growth.stageName || advisory?.cropStage?.label || null
  const bbch = toNumber(growth.bbchStage ?? advisory?.cropStage?.bbchStage)
  const rawProgress = toNumber(growth.overallProgress)
  const modelProgress =
    rawProgress == null ? null : rawProgress <= 1 ? rawProgress * 100 : rawProgress
  const week = days != null && days >= 0 ? Math.floor(days / 7) + 1 : null
  const cycleProgress =
    week != null && cycleWeeks ? Math.min(100, ((days + 1) / (cycleWeeks * 7)) * 100) : null
  const progress = modelProgress ?? cycleProgress

  return (
    <div className={cardClass}>
      <h3 className="text-sm font-semibold text-gray-900">Plant Growth Activity</h3>
      {field.isBarrenLand || days == null || days < 0 ? (
        <p className="py-6 text-sm text-gray-500">
          {field.isBarrenLand
            ? 'This field is marked as barren land — no standing crop to track.'
            : 'Sowing date is not available for this field.'}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-50">
              <Sprout className="h-5 w-5 text-lime-600" />
            </span>
            <div>
              <p className="text-sm font-semibold capitalize text-gray-900">
                {formatFieldCrops(field)}
              </p>
              <p className="text-sm text-gray-600">
                {loading
                  ? 'Loading growth stage…'
                  : stage
                    ? `Stage: ${stage}${bbch != null ? ` (BBCH ${bbch})` : ''}`
                    : 'Growth stage not reported yet'}
              </p>
              {growth.description ? (
                <p className="mt-1 text-xs text-gray-500">{growth.description}</p>
              ) : null}
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoItem label="Days since sowing" value={days} />
            <InfoItem
              label="Current week"
              value={
                cycleWeeks ? `Week ${Math.min(week, cycleWeeks)} of ${cycleWeeks}` : `Week ${week}`
              }
            />
            <InfoItem
              label="Crop age (model)"
              value={toNumber(growth.cropAgeDays) != null ? `${growth.cropAgeDays} days` : '—'}
            />
            <InfoItem label="Typical cycle" value={cycleWeeks ? `${cycleWeeks} weeks` : '—'} />
          </dl>
          {progress != null ? (
            <div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {modelProgress != null
                    ? 'Growth progress (advisory model)'
                    : 'Progress through typical cycle'}
                </span>
                <span className="font-semibold text-gray-800">{Math.round(progress)}%</span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#86D72F]"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
