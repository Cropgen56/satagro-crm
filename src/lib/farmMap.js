import { fetchFarmers } from '@/lib/farmers'
import {
  fetchFarmerFields,
  formatEnumLabel,
  formatFieldCrops,
  getFieldCrops,
  getFieldSowingDate,
  ringAreaSquareMeters,
  toRing,
} from '@/lib/farmAnalytics'

const FARMER_PAGE_SIZE = 100
const FIELD_CONCURRENCY = 6
const PROGRESS_INTERVAL_MS = 400

export async function loadOrgMapFields({ onProgress, isCancelled = () => false }) {
  const farmers = []
  for (let page = 1, totalPages = 1; page <= totalPages; page += 1) {
    if (isCancelled()) return
    const res = await fetchFarmers({ page, limit: FARMER_PAGE_SIZE })
    farmers.push(...(res?.farmers || []))
    totalPages = Number(res?.pagination?.totalPages) || 1
  }

  const owners = farmers.filter((f) => Number(f.fieldCount) > 0)
  const fields = []
  let loadedFarmers = 0
  let failedFarmers = 0
  let lastEmit = 0

  const emit = (done = false) => {
    lastEmit = Date.now()
    onProgress({
      fields: [...fields],
      loadedFarmers,
      totalFarmers: owners.length,
      failedFarmers,
      done,
    })
  }

  emit(owners.length === 0)
  if (!owners.length) return

  let cursor = 0
  const worker = async () => {
    while (cursor < owners.length && !isCancelled()) {
      const owner = owners[cursor]
      cursor += 1
      try {
        const farmerFields = await fetchFarmerFields(owner.id)
        farmerFields.forEach((field) => {
          const ring = toRing(field.field)
          if (ring.length >= 4) fields.push(toMapField(field, ring, owner))
        })
      } catch {
        failedFarmers += 1
      }
      loadedFarmers += 1
      if (Date.now() - lastEmit > PROGRESS_INTERVAL_MS) emit()
    }
  }

  await Promise.all(Array.from({ length: FIELD_CONCURRENCY }, worker))
  if (!isCancelled()) emit(true)
}

function toMapField(field, ring, owner) {
  const crops = getFieldCrops(field)
    .map((c) => c.cropName)
    .filter(Boolean)
  const acre = Number(field.acre) || 0
  return {
    id: field._id,
    fieldName: field.fieldName || 'Unnamed field',
    crops,
    cropLabel: formatFieldCrops(field),
    variety: [
      ...new Set(
        getFieldCrops(field)
          .map((c) => c.variety)
          .filter(Boolean),
      ),
    ].join(' · '),
    acre,
    hectare: acre * 0.404686,
    sowingDate: getFieldSowingDate(field),
    isBarrenLand: Boolean(field.isBarrenLand),
    typeOfFarming: field.typeOfFarming || '',
    farmingLabel: formatEnumLabel(field.typeOfFarming),
    irrigationLabel: formatEnumLabel(field.typeOfIrrigation),
    subscribed: Boolean(field.subscription?.hasActiveSubscription),
    planName: field.subscription?.plan?.name || null,
    ring,
    latLngs: ring.slice(0, -1).map(([lng, lat]) => [lat, lng]),
    centroid: ringCentroid(ring),
    perimeterM: ringPerimeterMeters(ring),
    owner: {
      id: owner.id,
      name: owner.name,
      phone: owner.phone,
      location: owner.location,
    },
  }
}

export function haversineMeters([lng1, lat1], [lng2, lat2]) {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

export function pathLengthMeters(points) {
  let total = 0
  for (let i = 1; i < points.length; i += 1) total += haversineMeters(points[i - 1], points[i])
  return total
}

function ringPerimeterMeters(ring) {
  return pathLengthMeters(ring)
}

function ringCentroid(ring) {
  let area = 0
  let cx = 0
  let cy = 0
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[i + 1]
    const cross = x1 * y2 - x2 * y1
    area += cross
    cx += (x1 + x2) * cross
    cy += (y1 + y2) * cross
  }
  if (Math.abs(area) < 1e-14) {
    const pts = ring.slice(0, -1)
    return [
      pts.reduce((s, p) => s + p[1], 0) / pts.length,
      pts.reduce((s, p) => s + p[0], 0) / pts.length,
    ]
  }
  return [cy / (3 * area), cx / (3 * area)]
}

export function polygonAreaSquareMeters(points) {
  if (points.length < 3) return 0
  return ringAreaSquareMeters([...points, points[0]])
}

export function formatLength(meters) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${Math.round(meters)} m`
}

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function exportFieldsGeoJson(fields) {
  const collection = {
    type: 'FeatureCollection',
    features: fields.map((f) => ({
      type: 'Feature',
      properties: {
        id: f.id,
        fieldName: f.fieldName,
        crops: f.crops,
        variety: f.variety,
        acre: f.acre,
        sowingDate: f.sowingDate,
        typeOfFarming: f.farmingLabel,
        typeOfIrrigation: f.irrigationLabel,
        subscribed: f.subscribed,
        plan: f.planName,
        farmerId: f.owner.id,
        farmerName: f.owner.name,
        phone: f.owner.phone,
      },
      geometry: { type: 'Polygon', coordinates: [f.ring] },
    })),
  }
  download('farms.geojson', JSON.stringify(collection, null, 2), 'application/geo+json')
}

export function exportFieldsCsv(fields) {
  const headers = [
    'Field name',
    'Crops',
    'Variety',
    'Farmer',
    'Phone',
    'Acres',
    'Hectares',
    'Sowing date',
    'Type of farming',
    'Type of irrigation',
    'Subscribed',
    'Plan',
    'Centroid lat',
    'Centroid lng',
    'Vertices',
  ]
  const rows = fields.map((f) =>
    [
      f.fieldName,
      f.crops.join(' + '),
      f.variety,
      f.owner.name,
      f.owner.phone,
      f.acre.toFixed(4),
      f.hectare.toFixed(4),
      f.sowingDate || '',
      f.farmingLabel,
      f.irrigationLabel,
      f.subscribed ? 'Yes' : 'No',
      f.planName || '',
      f.centroid[0].toFixed(6),
      f.centroid[1].toFixed(6),
      f.latLngs.length,
    ]
      .map((v) => {
        const text = String(v ?? '')
        const safe = /^[=+\-@\t\r]/.test(text) && Number.isNaN(Number(text)) ? `'${text}` : text
        return `"${safe.replace(/"/g, '""')}"`
      })
      .join(','),
  )
  download('farms.csv', [headers.join(','), ...rows].join('\n'), 'text/csv')
}
