import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CalendarRange, Loader2, MapPinOff } from 'lucide-react'
import useAsyncData from '@/hooks/useAsyncData'
import {
  DEFAULT_SATELLITE_INDEX,
  SATELLITE_INDICES,
  SATELLITE_OPTIONS,
  fetchIndexImage,
  fetchSatelliteDates,
  toRing,
} from '@/lib/farmAnalytics'

const todayIso = () => new Date().toISOString().slice(0, 10)
const monthsAgoIso = (months) => {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

function formatShortDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ringBounds(ring) {
  const lats = ring.map(([, lat]) => lat)
  const lngs = ring.map(([lng]) => lng)
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ]
}

function clipPathFor(ring, bounds) {
  const [[south, west], [north, east]] = bounds
  const width = east - west
  const height = north - south
  if (!width || !height) return ''
  const points = ring.map(([lng, lat]) => {
    const x = ((lng - west) / width) * 100
    const y = ((north - lat) / height) * 100
    return `${x.toFixed(3)}% ${y.toFixed(3)}%`
  })
  return `polygon(${points.join(', ')})`
}

function SatelliteLeafletMap({ ring, imageUrl, imageBounds }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const fillRef = useRef(null)
  const bounds = useMemo(() => ringBounds(ring), [ring])

  useEffect(() => {
    const map = L.map(containerRef.current, {
      attributionControl: false,
      scrollWheelZoom: true,
    })
    L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 21,
    }).addTo(map)

    const latLngs = ring.map(([lng, lat]) => [lat, lng])
    fillRef.current = L.polygon(latLngs, {
      stroke: false,
      fillColor: '#e9ecef',
      fillOpacity: 0.85,
      interactive: false,
    }).addTo(map)
    L.polygon(latLngs, { color: '#16a34a', weight: 3, fill: false, interactive: false }).addTo(map)
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 })
    mapRef.current = map

    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
      fillRef.current = null
    }
  }, [ring, bounds])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return undefined
    fillRef.current?.setStyle({ fillOpacity: imageUrl ? 0 : 0.85 })
    if (!imageUrl) return undefined

    const extent = imageBounds || bounds
    const clipPath = clipPathFor(ring, extent)
    const overlay = L.imageOverlay(imageUrl, extent, { interactive: false }).addTo(map)
    const applyClip = () => {
      const img = overlay.getElement()
      if (img && clipPath) {
        img.style.clipPath = clipPath
        img.style.webkitClipPath = clipPath
      }
    }
    applyClip()
    overlay.on('load', applyClip)

    return () => {
      overlay.off('load', applyClip)
      map.removeLayer(overlay)
    }
  }, [imageUrl, imageBounds, ring, bounds])

  return <div ref={containerRef} className="h-full w-full" />
}

export default function FieldSatelliteMap({ field, heightClass = 'h-[360px] lg:h-[420px]' }) {
  const fieldId = field?._id
  const ring = useMemo(() => toRing(field?.field), [field?.field])

  const [satellite, setSatellite] = useState('s2')
  const [index, setIndex] = useState(DEFAULT_SATELLITE_INDEX.s2)
  const [range, setRange] = useState(() => ({ start: monthsAgoIso(6), end: todayIso() }))
  const [draftRange, setDraftRange] = useState(range)
  const [rangeError, setRangeError] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  const hasRing = ring.length >= 4

  const datesQuery = useAsyncData(
    hasRing ? `dates:${fieldId}:${satellite}:${range.start}:${range.end}` : null,
    (signal) =>
      fetchSatelliteDates(
        { ring, startDate: range.start, endDate: range.end, satellite },
        { signal },
      ),
  )
  const dates = useMemo(() => datesQuery.data || [], [datesQuery.data])
  const activeDate = dates.some((d) => d.date === selectedDate)
    ? selectedDate
    : dates[0]?.date || ''

  const imageQuery = useAsyncData(
    hasRing && activeDate ? `image:${fieldId}:${satellite}:${activeDate}:${index}` : null,
    (signal) => fetchIndexImage({ ring, date: activeDate, index, satellite }, { signal }),
  )
  const imageUrl = imageQuery.data?.image_base64
    ? `data:image/png;base64,${imageQuery.data.image_base64}`
    : null
  const legend = Array.isArray(imageQuery.data?.legend) ? imageQuery.data.legend : []
  const imageBounds = useMemo(() => {
    const b = imageQuery.data?.bounds
    if (!Array.isArray(b) || b.length !== 4 || !b.every(Number.isFinite)) return null
    return [
      [b[1], b[0]],
      [b[3], b[2]],
    ]
  }, [imageQuery.data])

  const changeSatellite = (next) => {
    setSatellite(next)
    setIndex(DEFAULT_SATELLITE_INDEX[next])
    setSelectedDate('')
  }

  const applyRange = () => {
    if (!draftRange.start || !draftRange.end) return setRangeError('Pick both dates.')
    if (draftRange.start >= draftRange.end) {
      return setRangeError('Start date must be before end date.')
    }
    if (draftRange.end > todayIso()) return setRangeError('End date cannot be in the future.')
    setRangeError('')
    setSelectedDate('')
    setRange(draftRange)
  }

  if (!hasRing) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <MapPinOff className="h-8 w-8 text-gray-300" />
        <p className="mt-2 text-sm font-medium text-gray-700">No boundary mapped</p>
        <p className="mt-1 text-xs text-gray-500">
          This field has no saved boundary points, so satellite data can't be shown.
        </p>
      </div>
    )
  }

  const isSar = satellite === 's1'

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          'relative isolate overflow-hidden rounded-xl border border-gray-100',
          heightClass,
        )}
      >
        <SatelliteLeafletMap ring={ring} imageUrl={imageUrl} imageBounds={imageBounds} />
        {imageQuery.loading ? (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/30">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
        ) : null}
        {legend.length ? (
          <div className="absolute right-2 top-2 z-[500] max-h-[70%] w-56 overflow-y-auto rounded-lg bg-white/95 p-2 text-xs shadow">
            <p className="px-1 pb-1 font-semibold text-gray-800">Legend</p>
            <ul className="space-y-1">
              {legend.map((item, i) => (
                <li key={`${item.label}-${i}`} className="flex items-center gap-2 px-1">
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1 truncate text-gray-700">{item.label}</span>
                  {item.hectares != null ? (
                    <span className="text-gray-500">{Number(item.hectares).toFixed(2)} ha</span>
                  ) : null}
                  {item.percent != null ? (
                    <span className="w-12 text-right text-gray-400">{item.percent}%</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-gray-600">
          Satellite
          <select
            value={satellite}
            onChange={(e) => changeSatellite(e.target.value)}
            className="mt-1 block rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800"
          >
            {SATELLITE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-gray-600">
          From
          <input
            type="date"
            value={draftRange.start}
            max={todayIso()}
            onChange={(e) => setDraftRange((r) => ({ ...r, start: e.target.value }))}
            className="mt-1 block rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-gray-600">
          To
          <input
            type="date"
            value={draftRange.end}
            max={todayIso()}
            onChange={(e) => setDraftRange((r) => ({ ...r, end: e.target.value }))}
            className="mt-1 block rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={applyRange}
          disabled={datesQuery.loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
        >
          <CalendarRange className="h-4 w-4" />
          Apply
        </button>
        {rangeError ? <p className="text-xs text-red-600">{rangeError}</p> : null}
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-gray-600">Acquisition dates</p>
        {datesQuery.loading ? (
          <p className="py-2 text-sm text-gray-500">Loading satellite dates…</p>
        ) : datesQuery.error ? (
          <p className="py-2 text-sm text-red-600">{datesQuery.error}</p>
        ) : dates.length === 0 ? (
          <p className="py-2 text-sm text-gray-500">
            No satellite passes found for this field in the selected range.
          </p>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className={clsx(
                  'shrink-0 rounded-lg border px-3 py-1.5 text-left text-xs transition-colors',
                  d.date === activeDate
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
                )}
              >
                <span className="block font-semibold">{formatShortDate(d.date)}</span>
                <span className={d.date === activeDate ? 'text-white/80' : 'text-gray-500'}>
                  {isSar
                    ? 'Radar'
                    : d.cloudCover != null
                      ? `${d.cloudCover.toFixed(1)}% cloud`
                      : 'Cloud n/a'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-gray-600">Index</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SATELLITE_INDICES[satellite].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setIndex(value)}
              className={clsx(
                'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                value === index
                  ? 'border-brand-primary bg-brand-light text-brand-primary'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {imageQuery.error ? <p className="mt-1 text-sm text-red-600">{imageQuery.error}</p> : null}
      </div>
    </div>
  )
}
