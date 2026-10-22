import { API_BASE_URL, apiRequest } from '@/lib/api'

const SERVER_ORIGIN = API_BASE_URL.replace(/\/v1\/api\/auth\/?$/, '')

const FIELD_API_URL = `${SERVER_ORIGIN}/v1/api/field`
const ADVISORY_API_URL = `${SERVER_ORIGIN}/v2/api/advisory`
const SATELLITE_API_URL = (
  import.meta.env.VITE_SATELLITE_API_URL || 'https://server.cropgenapp.com/v4/api'
).replace(/\/$/, '')
const SATELLITE_API_KEY = import.meta.env.VITE_SATELLITE_API_KEY || 'CROPGEN_230498adklfjadsljf'
const WEATHER_API_URL = 'https://observearth.com/api'
const WEATHER_API_KEY =
  import.meta.env.VITE_OBSERVEARTH_API_KEY || '5b97d3f0-a01a-490b-aad1-3bfa848309f2'

const SATELLITE_TIMEOUT_MS = 120000
const DEFAULT_TIMEOUT_MS = 30000

async function requestJson(url, { method = 'GET', body, headers, signal, timeout } = {}) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort)
  const timer = setTimeout(abort, timeout || DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    let data = null
    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      const detail = Array.isArray(data?.detail)
        ? data.detail.map((item) => item?.msg || String(item)).join('; ')
        : data?.detail
      const error = new Error(
        detail || data?.message || data?.error || `Request failed with status ${response.status}`,
      )
      error.status = response.status
      throw error
    }

    return data
  } catch (err) {
    if (err.name === 'AbortError' && !signal?.aborted) {
      throw new Error('The request timed out. Please try again.')
    }
    throw err
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

const responseCache = new Map()

async function cached(key, loader) {
  if (responseCache.has(key)) return responseCache.get(key)
  const data = await loader()
  responseCache.set(key, data)
  return data
}

export async function fetchFarmerFields(userId) {
  const data = await apiRequest(`${FIELD_API_URL}/get-field/${userId}`)
  return Array.isArray(data?.farmFields) ? data.farmFields : []
}

export async function fetchLatestFieldAdvisory(fieldId) {
  const data = await apiRequest(`${ADVISORY_API_URL}/${fieldId}?page=1&limit=1`)
  return data?.advisories?.[0] || null
}

const FULL_GEOMETRY_MAX_HECTARES = 2
const SAMPLE_HECTARES = 1.5
const METERS_PER_DEG_LAT = 111320
const EARTH_RADIUS_M = 6378137

export function toRing(points) {
  if (!Array.isArray(points)) return []
  const ring = points
    .map((p) => [Number(p?.lng), Number(p?.lat)])
    .filter(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat))
  if (ring.length < 3) return []
  const [firstLng, firstLat] = ring[0]
  const [lastLng, lastLat] = ring[ring.length - 1]
  if (firstLng !== lastLng || firstLat !== lastLat) ring.push([firstLng, firstLat])
  return ring
}

export function hasBoundary(field) {
  return toRing(field?.field).length >= 4
}

export function ringAreaSquareMeters(ring) {
  let total = 0
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [lng1, lat1] = ring[i]
    const [lng2, lat2] = ring[i + 1]
    total +=
      (((lng2 - lng1) * Math.PI) / 180) *
      (2 + Math.sin((lat1 * Math.PI) / 180) + Math.sin((lat2 * Math.PI) / 180))
  }
  return Math.abs((total * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2)
}

function toAvailabilityPolygon(ring) {
  if (ringAreaSquareMeters(ring) / 10000 <= FULL_GEOMETRY_MAX_HECTARES) {
    return { type: 'Polygon', coordinates: [ring] }
  }
  const points = ring.slice(0, -1)
  const lng = points.reduce((sum, p) => sum + p[0], 0) / points.length
  const lat = points.reduce((sum, p) => sum + p[1], 0) / points.length
  const half = Math.sqrt(SAMPLE_HECTARES * 10000) / 2
  const dLat = half / METERS_PER_DEG_LAT
  const dLng = half / (METERS_PER_DEG_LAT * (Math.abs(Math.cos((lat * Math.PI) / 180)) || 0.2))
  return {
    type: 'Polygon',
    coordinates: [
      [
        [lng - dLng, lat - dLat],
        [lng + dLng, lat - dLat],
        [lng + dLng, lat + dLat],
        [lng - dLng, lat + dLat],
        [lng - dLng, lat - dLat],
      ],
    ],
  }
}

export const SATELLITE_OPTIONS = [
  { value: 's2', label: 'Sentinel-2 (optical)' },
  { value: 's1', label: 'Sentinel-1 (radar)' },
]

export const DEFAULT_SATELLITE_INDEX = { s2: 'NDVI', s1: 'RVI' }

export const SATELLITE_INDICES = {
  s2: [
    ['TRUE_COLOR', 'True Color'],
    ['NDVI', 'Crop Health'],
    ['EVI', 'Improved Crop Health'],
    ['EVI2', 'Crop Health (Simplified)'],
    ['SAVI', 'Crop Health (Early Stage)'],
    ['MSAVI', 'Crop Health (Dry Land)'],
    ['NDMI', 'Water in Crop'],
    ['NDWI', 'Plant Water Level'],
    ['SMI', 'Soil Moisture'],
    ['CCC', 'Leaf Greenness'],
    ['NITROGEN', 'Nitrogen Level'],
    ['SOC', 'Soil Fertility'],
    ['NDRE', 'Crop Stress / Maturity'],
    ['RECI', 'Leaf Richness'],
  ],
  s1: [
    ['RVI', 'Vegetation Health'],
    ['VV', 'Soil Moisture'],
    ['VH', 'Crop Biomass'],
    ['VV_VH', 'Crop Structure'],
    ['VH_VV', 'Crop Growth'],
    ['SDWI', 'Waterlogging Risk'],
    ['SIGMA0_VV', 'Soil Reflectance (σ0 VV)'],
    ['SIGMA0_VH', 'Vegetation Reflectance (σ0 VH)'],
    ['GAMMA0_VV', 'Terrain-corrected Soil Moisture'],
    ['GAMMA0_VH', 'Terrain-corrected Crop Biomass'],
  ],
}

const satelliteHeaders = { 'x-api-key': SATELLITE_API_KEY }

function toIsoDay(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export async function fetchSatelliteDates(
  { ring, startDate, endDate, satellite },
  { signal } = {},
) {
  const body = {
    geometry: toAvailabilityPolygon(ring),
    start_date: startDate,
    end_date: endDate,
    provider: 'both',
    satellite,
  }
  const data = await cached(`dates:${JSON.stringify(body)}`, () =>
    requestJson(`${SATELLITE_API_URL}/availability/`, {
      method: 'POST',
      body,
      headers: satelliteHeaders,
      signal,
      timeout: SATELLITE_TIMEOUT_MS,
    }),
  )

  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data?.items)
      ? data.data.items
      : Array.isArray(data?.dates)
        ? data.dates.map((d) => (typeof d === 'string' ? { date: d } : d))
        : Array.isArray(data)
          ? data
          : []

  const byDay = new Map()
  items.forEach((item) => {
    const day = toIsoDay(
      item?.date || item?.datetime || item?.acquisition_date || item?.properties?.datetime,
    )
    if (!day || byDay.has(day)) return
    const cloud = Number(item?.cloud_cover)
    byDay.set(day, { date: day, cloudCover: Number.isFinite(cloud) ? cloud : null })
  })

  return [...byDay.values()].sort((a, b) => b.date.localeCompare(a.date))
}

export function fetchIndexImage({ ring, date, index, satellite }, { signal } = {}) {
  const body = {
    geometry: { type: 'Polygon', coordinates: [ring] },
    date,
    index_name: index,
    provider: 'both',
    satellite,
    width: 800,
    height: 800,
    supersample: 1,
    smooth: false,
    gaussian_sigma: 1,
  }
  return cached(`index:${JSON.stringify(body)}`, () =>
    requestJson(`${SATELLITE_API_URL}/calculate/index`, {
      method: 'POST',
      body,
      headers: satelliteHeaders,
      signal,
      timeout: SATELLITE_TIMEOUT_MS,
    }),
  )
}

export async function fetchIndexTimeSeries(
  { ring, startDate, endDate, index, family },
  { signal } = {},
) {
  const body = {
    geometry: { type: 'Polygon', coordinates: [ring] },
    start_date: startDate,
    end_date: endDate,
    index,
    provider: 'both',
    satellite: 's2',
    max_items: 200,
  }
  const data = await cached(`series:${family}:${JSON.stringify(body)}`, () =>
    requestJson(`${SATELLITE_API_URL}/timeseries/${family}/${family}`, {
      method: 'POST',
      body,
      headers: satelliteHeaders,
      signal,
      timeout: SATELLITE_TIMEOUT_MS,
    }),
  )

  const series = data?.data?.timeseries || data?.timeseries || (Array.isArray(data) ? data : [])
  const points = (Array.isArray(series) ? series : [])
    .map((item) => ({ date: toIsoDay(item?.date), value: Number(item?.value) }))
    .filter((p) => p.date && Number.isFinite(p.value))
    .sort((a, b) => a.date.localeCompare(b.date))

  return { points, summary: data?.data?.summary || data?.summary || null }
}

const weatherHeaders = { 'X-API-Key': WEATHER_API_KEY }
let aoiListPromise = null

const MAX_AOI_PAGES = 100

async function fetchAllAois() {
  const all = []
  let url = `${WEATHER_API_URL}/geometry/?detail=false`
  for (let page = 0; url && page < MAX_AOI_PAGES; page += 1) {
    const data = await requestJson(url, { headers: weatherHeaders })
    if (Array.isArray(data)) return all.concat(data)
    all.push(...(data?.results || []))
    url = data?.next ? String(data.next).replace(/^http:\/\//, 'https://') : null
  }
  return all
}

function loadAois({ refresh = false } = {}) {
  if (!aoiListPromise || refresh) {
    aoiListPromise = fetchAllAois().catch((err) => {
      aoiListPromise = null
      throw err
    })
  }
  return aoiListPromise
}

const aoiIdPromises = new Map()

function resolveAoiId(fieldId, ring) {
  if (!aoiIdPromises.has(fieldId)) {
    aoiIdPromises.set(
      fieldId,
      findOrCreateAoi(fieldId, ring).catch((err) => {
        aoiIdPromises.delete(fieldId)
        throw err
      }),
    )
  }
  return aoiIdPromises.get(fieldId)
}

async function findOrCreateAoi(fieldId, ring) {
  const existing = (await loadAois()).find((aoi) => aoi.name === fieldId)
  if (existing?.id) return existing.id

  try {
    const created = await requestJson(`${WEATHER_API_URL}/geometry/`, {
      method: 'POST',
      headers: weatherHeaders,
      body: { name: fieldId, geometry: { type: 'Polygon', coordinates: [ring] } },
    })
    await loadAois({ refresh: true })
    if (created?.id) return created.id
  } catch (err) {
    if (err.status !== 400 && err.status !== 409) throw err
  }

  const retry = (await loadAois({ refresh: true })).find((aoi) => aoi.name === fieldId)
  if (!retry?.id) throw new Error('Weather area could not be registered for this field.')
  return retry.id
}

export async function fetchFieldForecast(fieldId, ring, { signal } = {}) {
  const geometryId = await resolveAoiId(fieldId, ring)
  return requestJson(`${WEATHER_API_URL}/weather/forecast/?geometry_id=${geometryId}`, {
    headers: weatherHeaders,
    signal,
  })
}

export function getFieldCrops(field) {
  const crops = Array.isArray(field?.crops) ? field.crops.filter((c) => c?.isActive !== false) : []
  if (crops.length) return crops
  if (field?.cropName) {
    return [{ cropName: field.cropName, variety: field.variety, startDate: field.sowingDate }]
  }
  return []
}

export function formatFieldCrops(field) {
  const names = getFieldCrops(field)
    .map((c) => c.cropName)
    .filter(Boolean)
  return names.length ? names.join(' + ') : '—'
}

export function formatFieldVarieties(field) {
  const varieties = [
    ...new Set(
      getFieldCrops(field)
        .map((c) => c.variety)
        .filter(Boolean),
    ),
  ]
  return varieties.length ? varieties.join(' · ') : '—'
}

export function getFieldSowingDate(field) {
  return (
    getFieldCrops(field)
      .map((c) => c.startDate)
      .find(Boolean) ||
    field?.sowingDate ||
    null
  )
}

const IRRIGATION_LABELS = {
  'open-irrigation': 'Open Irrigation',
  'drip-irrigation': 'Drip Irrigation',
  flood_surface: 'Flood / Surface',
  center_pivot: 'Center Pivot',
  micro_irrigation: 'Micro Irrigation',
  not_specified: 'Not Specified',
}

export function formatEnumLabel(value) {
  if (!value || value === 'N/A') return '—'
  if (IRRIGATION_LABELS[value]) return IRRIGATION_LABELS[value]
  return String(value)
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function parseFieldDate(value) {
  if (!value) return null
  const text = String(value).trim()
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  const d = dmy ? new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])) : new Date(text)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatFieldDate(value) {
  const d = parseFieldDate(value)
  if (!d) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysSince(value) {
  const d = parseFieldDate(value)
  if (!d) return null
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

export function timeAgo(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const minutes = Math.floor((Date.now() - d.getTime()) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

export function healthTone(percentage) {
  if (percentage == null) return { label: 'No data', bar: 'bg-gray-300', text: 'text-gray-500' }
  if (percentage > 70) return { label: 'Good', bar: 'bg-[#86D72F]', text: 'text-green-700' }
  if (percentage > 50) return { label: 'Moderate', bar: 'bg-[#FFCC66]', text: 'text-amber-700' }
  return { label: 'Poor', bar: 'bg-[#E40000]', text: 'text-red-700' }
}
