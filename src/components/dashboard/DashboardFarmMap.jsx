import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import {
  ChevronDown,
  ChevronUp,
  Crosshair,
  Download,
  ExternalLink,
  Filter,
  Layers,
  List,
  Loader2,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Ruler,
  Search,
  Tag,
  Trash2,
  User,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import {
  exportFieldsCsv,
  exportFieldsGeoJson,
  formatLength,
  loadOrgMapFields,
  pathLengthMeters,
  polygonAreaSquareMeters,
} from '@/lib/farmMap'
import { formatEnumLabel, formatFieldDate } from '@/lib/farmAnalytics'

const BASEMAPS = {
  satellite: {
    label: 'Satellite',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
  },
  hybrid: {
    label: 'Hybrid',
    url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
  },
  street: {
    label: 'Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
  },
  terrain: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 17,
  },
}

const FARM_COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#84cc16',
  '#0ea5e9',
  '#d946ef',
]

const BASE_STYLE = { weight: 2, fillOpacity: 0.3 }
const SELECTED_STYLE = { weight: 3, fillOpacity: 0.5 }
const HOVER_STYLE = { weight: 3, fillOpacity: 0.6 }
const LEGEND_LIMIT = 8

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c],
  )
}

function tooltipHtml(field, color) {
  const row = (label, value) =>
    `<div class="fmt-row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value || '—')}</b></div>`
  return `
    <div class="fmt-card">
      <div class="fmt-head" style="background:${color}">
        <p class="fmt-title">${escapeHtml(field.fieldName)}</p>
        <p class="fmt-sub">${escapeHtml(field.cropLabel)}${field.variety ? ` · ${escapeHtml(field.variety)}` : ''}</p>
      </div>
      <div class="fmt-owner">
        <p class="fmt-owner-name">${escapeHtml(field.owner.name)}</p>
        <p class="fmt-owner-phone">${escapeHtml(field.owner.phone)}</p>
      </div>
      <div class="fmt-stats">
        <div><span>Area</span><b>${field.acre.toFixed(2)} ac</b></div>
        <div><span>Hectares</span><b>${field.hectare.toFixed(2)} ha</b></div>
        <div><span>Perimeter</span><b>${escapeHtml(formatLength(field.perimeterM))}</b></div>
      </div>
      ${row('Type of farming', field.farmingLabel)}
      ${row('Type of irrigation', field.irrigationLabel)}
      ${row(field.isBarrenLand ? 'Expected sowing' : 'Sowing', formatFieldDate(field.sowingDate))}
      ${row('Subscription', field.subscribed ? field.planName || 'Active' : 'None')}
      ${row('Vertices', `${field.latLngs.length} pts`)}
      ${row('Center', `${field.centroid[0].toFixed(5)}, ${field.centroid[1].toFixed(5)}`)}
      <p class="fmt-foot">Click to inspect field</p>
    </div>`
}

function boundsOf(fields) {
  const bounds = L.latLngBounds([])
  fields.forEach((f) => f.latLngs.forEach((p) => bounds.extend(p)))
  return bounds
}

function ToolButton({
  active,
  activeClass = 'bg-brand-primary text-white hover:bg-brand-950',
  title,
  onClick,
  children,
  badge,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={clsx(
        'relative flex h-8 w-8 items-center justify-center rounded-lg shadow transition-colors',
        active ? activeClass : 'bg-white/90 text-gray-700 hover:bg-white',
      )}
    >
      {children}
      {badge ? (
        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

function MenuPanel({ className, children }) {
  return (
    <div
      className={clsx(
        'absolute right-0 top-10 z-30 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default function DashboardFarmMap() {
  const navigate = useNavigate()

  const wrapperRef = useRef(null)
  const toolbarRef = useRef(null)
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const tileRef = useRef(null)
  const shapesRef = useRef(null)
  const polygonsRef = useRef(new Map())
  const labelsRef = useRef(null)
  const measureLayerRef = useRef(null)
  const measureModeRef = useRef(null)
  const userMovedRef = useRef(false)
  const fitRef = useRef({ first: false, final: false })

  const [load, setLoad] = useState({
    fields: [],
    loadedFarmers: 0,
    totalFarmers: 0,
    failedFarmers: 0,
    done: false,
    error: '',
  })
  const [basemap, setBasemap] = useState('satellite')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [cursor, setCursor] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showLabels, setShowLabels] = useState(false)
  const [clusterMode, setClusterMode] = useState(false)
  const [measureMode, setMeasureMode] = useState(null)
  const [measurePts, setMeasurePts] = useState([])
  const [measureDone, setMeasureDone] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [activeCrops, setActiveCrops] = useState(() => new Set())
  const [activeFarming, setActiveFarming] = useState(() => new Set())
  const [fieldSearch, setFieldSearch] = useState('')
  const [placeQuery, setPlaceQuery] = useState('')
  const [placeResults, setPlaceResults] = useState({ status: 'idle', items: [] })
  const [legendOpen, setLegendOpen] = useState(false)

  const fields = load.fields
  const loading = !load.done

  const colorById = useMemo(() => {
    const map = new Map()
    fields.forEach((f, i) => map.set(f.id, FARM_COLORS[i % FARM_COLORS.length]))
    return map
  }, [fields])

  const cropOptions = useMemo(
    () => [...new Set(fields.flatMap((f) => f.crops))].sort((a, b) => a.localeCompare(b)),
    [fields],
  )
  const farmingOptions = useMemo(
    () => [...new Set(fields.map((f) => f.typeOfFarming).filter(Boolean))].sort(),
    [fields],
  )
  const filterCount = activeCrops.size + activeFarming.size

  const visibleFields = useMemo(() => {
    if (!filterCount) return fields
    return fields.filter(
      (f) =>
        (!activeCrops.size || f.crops.some((c) => activeCrops.has(c))) &&
        (!activeFarming.size || activeFarming.has(f.typeOfFarming)),
    )
  }, [fields, activeCrops, activeFarming, filterCount])

  const selectedField = visibleFields.find((f) => f.id === selectedId) || null

  const listedFields = useMemo(() => {
    const q = fieldSearch.trim().toLowerCase()
    if (!q) return visibleFields
    return visibleFields.filter((f) =>
      [f.fieldName, f.cropLabel, f.owner.name, f.owner.phone].some((v) =>
        String(v || '')
          .toLowerCase()
          .includes(q),
      ),
    )
  }, [visibleFields, fieldSearch])

  const totalAcres = visibleFields.reduce((s, f) => s + f.acre, 0)

  const measureResult = useMemo(() => {
    const pts = measurePts.map((p) => [p.lng, p.lat])
    if (measureMode === 'distance' && pts.length >= 2) return formatLength(pathLengthMeters(pts))
    if (measureMode === 'area' && pts.length >= 3) {
      const ha = polygonAreaSquareMeters(pts) / 10000
      return `${ha.toFixed(3)} ha / ${(ha * 2.47105).toFixed(3)} ac`
    }
    return null
  }, [measurePts, measureMode])

  useEffect(() => {
    let cancelled = false
    loadOrgMapFields({
      isCancelled: () => cancelled,
      onProgress: (progress) => {
        if (!cancelled) setLoad({ ...progress, error: '' })
      },
    }).catch((err) => {
      if (!cancelled) {
        setLoad((s) => ({ ...s, done: true, error: err?.message || 'Failed to load farms' }))
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      preferCanvas: true,
      zoomControl: false,
      attributionControl: false,
    })
    L.control.scale({ position: 'bottomright', imperial: false }).addTo(map)
    shapesRef.current = L.layerGroup().addTo(map)
    labelsRef.current = L.layerGroup().addTo(map)
    measureLayerRef.current = L.layerGroup().addTo(map)

    let frame = 0
    const onMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setCursor(e.latlng))
    }
    const onOut = () => {
      cancelAnimationFrame(frame)
      setCursor(null)
    }
    map.on('mousemove', onMove)
    map.on('mouseout', onOut)

    const markMoved = () => {
      userMovedRef.current = true
    }
    const el = containerRef.current
    el.addEventListener('mousedown', markMoved)
    el.addEventListener('wheel', markMoved, { passive: true })
    el.addEventListener('touchstart', markMoved, { passive: true })

    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(el)
    mapRef.current = map

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      el.removeEventListener('mousedown', markMoved)
      el.removeEventListener('wheel', markMoved)
      el.removeEventListener('touchstart', markMoved)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const config = BASEMAPS[basemap] || BASEMAPS.satellite
    const layer = L.tileLayer(config.url, {
      subdomains: config.subdomains,
      maxZoom: config.maxZoom,
    }).addTo(map)
    layer.bringToBack()
    tileRef.current?.remove()
    tileRef.current = layer
  }, [basemap])

  useEffect(() => {
    const group = shapesRef.current
    group.clearLayers()
    polygonsRef.current = new Map()

    if (clusterMode) {
      const cluster = L.markerClusterGroup({
        maxClusterRadius: 60,
        showCoverageOnHover: false,
        chunkedLoading: true,
      })
      visibleFields.forEach((field) => {
        const color = colorById.get(field.id)
        const marker = L.marker(field.centroid, {
          icon: L.divIcon({
            className: '',
            html: `<div style="width:14px;height:14px;background:${color};border:2.5px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.5)"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          }),
          title: field.fieldName,
        })
        marker.on('click', () => {
          if (!measureModeRef.current) setSelectedId(field.id)
        })
        cluster.addLayer(marker)
      })
      group.addLayer(cluster)
      return
    }

    visibleFields.forEach((field) => {
      const color = colorById.get(field.id)
      const polygon = L.polygon(field.latLngs, { ...BASE_STYLE, color, fillColor: color })
      polygon.bindTooltip(tooltipHtml(field, color), {
        sticky: true,
        offset: [12, 0],
        opacity: 1,
        className: 'farm-map-tooltip',
      })
      polygon.on('tooltipopen', () => {
        if (measureModeRef.current) polygon.closeTooltip()
      })
      polygon.on('mouseover', () => {
        if (!measureModeRef.current) polygon.setStyle(HOVER_STYLE)
      })
      polygon.on('mouseout', () => {
        polygon.setStyle(polygon.options.selected ? SELECTED_STYLE : BASE_STYLE)
      })
      polygon.on('click', () => {
        if (!measureModeRef.current) setSelectedId(field.id)
      })
      polygonsRef.current.set(field.id, polygon)
      group.addLayer(polygon)
    })
  }, [visibleFields, clusterMode, colorById])

  useEffect(() => {
    polygonsRef.current.forEach((polygon, id) => {
      const selected = id === selectedId
      polygon.options.selected = selected
      polygon.setStyle({
        ...(selected ? SELECTED_STYLE : BASE_STYLE),
        color: selected ? '#ffffff' : colorById.get(id),
      })
      if (selected) polygon.bringToFront()
    })
  }, [selectedId, visibleFields, clusterMode, colorById])

  useEffect(() => {
    const group = labelsRef.current
    group.clearLayers()
    if (!showLabels) return
    visibleFields.forEach((field) => {
      L.marker(field.centroid, {
        interactive: false,
        zIndexOffset: -500,
        icon: L.divIcon({
          className: '',
          iconSize: [0, 0],
          html: `<div class="farm-map-label">${escapeHtml(field.fieldName)}</div>`,
        }),
      }).addTo(group)
    })
  }, [showLabels, visibleFields])

  useEffect(() => {
    const map = mapRef.current
    if (!fields.length) return
    const fit = fitRef.current
    const shouldFit = !fit.first || (load.done && !fit.final && !userMovedRef.current)
    if (!shouldFit) return
    const bounds = boundsOf(fields)
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16, animate: false })
    fit.first = true
    if (load.done) fit.final = true
  }, [fields, load.done])

  useEffect(() => {
    if (!selectedId) return
    const field = fields.find((f) => f.id === selectedId)
    if (!field) return
    mapRef.current.fitBounds(L.latLngBounds(field.latLngs), {
      padding: [60, 60],
      maxZoom: 18,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const fitAll = () => {
    const bounds = boundsOf(visibleFields)
    if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [40, 40] })
  }

  useEffect(() => {
    measureModeRef.current = measureMode
    const map = mapRef.current
    if (!measureMode || measureDone) {
      map.getContainer().style.cursor = ''
      return undefined
    }
    map.getContainer().style.cursor = 'crosshair'
    map.doubleClickZoom.disable()
    let timer = 0
    const onClick = (e) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setMeasurePts((pts) => [...pts, { lat: e.latlng.lat, lng: e.latlng.lng }])
      }, 220)
    }
    const onDblClick = () => {
      clearTimeout(timer)
      setMeasureDone(true)
    }
    map.on('click', onClick)
    map.on('dblclick', onDblClick)
    return () => {
      clearTimeout(timer)
      map.off('click', onClick)
      map.off('dblclick', onDblClick)
      map.doubleClickZoom.enable()
      map.getContainer().style.cursor = ''
    }
  }, [measureMode, measureDone])

  useEffect(() => {
    const group = measureLayerRef.current
    group.clearLayers()
    if (!measureMode || !measurePts.length) return
    const color = measureMode === 'distance' ? '#f59e0b' : '#8b5cf6'
    const latLngs = measurePts.map((p) => [p.lat, p.lng])
    if (measureMode === 'distance' && latLngs.length >= 2) {
      L.polyline(latLngs, { color, weight: 2.5, dashArray: '8 5', interactive: false }).addTo(group)
    }
    if (measureMode === 'area' && latLngs.length >= 3) {
      L.polygon(latLngs, {
        color,
        fillColor: color,
        weight: 2,
        fillOpacity: 0.2,
        dashArray: '8 5',
        interactive: false,
      }).addTo(group)
    }
    latLngs.forEach((p) =>
      L.circleMarker(p, {
        radius: 5,
        color: '#fff',
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
        interactive: false,
      }).addTo(group),
    )
  }, [measurePts, measureMode])

  const setMeasure = (mode) => {
    setMeasureMode(mode)
    setMeasurePts([])
    setMeasureDone(false)
    setOpenMenu(null)
  }

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    if (!openMenu) return undefined
    const onDown = (e) => {
      if (!toolbarRef.current?.contains(e.target)) setOpenMenu(null)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openMenu])

  const toggleMenu = (name) => setOpenMenu((current) => (current === name ? null : name))

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else wrapperRef.current?.requestFullscreen?.().catch(() => {})
  }

  const toggleInSet = (setter) => (value) =>
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })

  const searchPlace = useCallback(async () => {
    const q = placeQuery.trim()
    if (!q) return
    setPlaceResults({ status: 'loading', items: [] })
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`,
        { headers: { Accept: 'application/json' } },
      )
      if (!res.ok) throw new Error()
      const items = await res.json()
      setPlaceResults({ status: 'done', items: Array.isArray(items) ? items : [] })
    } catch {
      setPlaceResults({ status: 'error', items: [] })
    }
  }, [placeQuery])

  const selectField = (id) => {
    if (measureMode) return
    setSelectedId(id)
    setOpenMenu(null)
  }

  const selectedColor = selectedField ? colorById.get(selectedField.id) : null

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        'relative isolate overflow-hidden rounded-2xl bg-gray-900 shadow',
        isFullscreen ? 'h-screen' : 'h-[520px]',
      )}
    >
      <div ref={containerRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute left-3 right-3 top-3 z-[1000] flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold leading-tight text-white drop-shadow-lg">Farm Map</h2>
          <p className="text-[11px] text-white/80 drop-shadow">
            {visibleFields.length}
            {filterCount ? ` / ${fields.length}` : ''} fields
            {clusterMode ? ' · cluster view' : ' · hover for details'}
          </p>
        </div>

        <div
          ref={toolbarRef}
          className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('fields')}
              className="flex h-8 items-center gap-2 rounded-lg bg-white/90 px-3 text-xs font-semibold text-gray-700 shadow hover:bg-white"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Fields</span>
              <span className="rounded-full bg-green-100 px-1.5 text-[10px] font-bold text-green-700">
                {visibleFields.length}
              </span>
              {openMenu === 'fields' ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            {openMenu === 'fields' ? (
              <MenuPanel className="w-80 max-w-[calc(100vw-2rem)]">
                <div className="border-b border-gray-100 p-2">
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5">
                    <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <input
                      autoFocus
                      value={fieldSearch}
                      onChange={(e) => setFieldSearch(e.target.value)}
                      placeholder="Search by field, crop, farmer, phone…"
                      className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
                    />
                    {fieldSearch ? (
                      <button
                        type="button"
                        onClick={() => setFieldSearch('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="border-b border-gray-100 bg-gray-50 px-3 py-1.5 text-[10px] text-gray-500">
                  {listedFields.length} of {visibleFields.length} fields
                </p>
                <div className="max-h-72 overflow-y-auto">
                  {listedFields.length ? (
                    listedFields.map((field) => (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => selectField(field.id)}
                        className={clsx(
                          'flex w-full items-center gap-2.5 border-b border-gray-50 px-3 py-2.5 text-left last:border-0',
                          field.id === selectedId ? 'bg-green-50' : 'hover:bg-gray-50',
                        )}
                      >
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full shadow ring-2 ring-white"
                          style={{ background: colorById.get(field.id) }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-gray-800">
                            {field.fieldName}
                          </span>
                          <span className="block truncate text-[10px] text-gray-500">
                            {field.cropLabel} · {field.owner.name}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[10px] font-semibold text-green-700">
                            {field.acre.toFixed(2)} ac
                          </span>
                          <span className="block text-[9px] text-gray-400">
                            {formatLength(field.perimeterM)}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="py-8 text-center text-xs text-gray-400">No fields match.</p>
                  )}
                </div>
              </MenuPanel>
            ) : null}
          </div>

          <div className="relative">
            <ToolButton
              title="Search location"
              active={openMenu === 'search'}
              onClick={() => toggleMenu('search')}
            >
              <Search className="h-3.5 w-3.5" />
            </ToolButton>
            {openMenu === 'search' ? (
              <MenuPanel className="w-72 max-w-[calc(100vw-2rem)]">
                <form
                  className="flex items-center gap-2 border-b border-gray-100 px-3 py-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    searchPlace()
                  }}
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <input
                    autoFocus
                    value={placeQuery}
                    onChange={(e) => setPlaceQuery(e.target.value)}
                    placeholder="Search place or address…"
                    className="flex-1 text-xs text-gray-700 outline-none placeholder:text-gray-400"
                  />
                  {placeResults.status === 'loading' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
                  ) : (
                    <button
                      type="submit"
                      className="text-[11px] font-bold text-green-600 hover:text-green-800"
                    >
                      Go
                    </button>
                  )}
                </form>
                <div className="max-h-52 overflow-y-auto">
                  {placeResults.items.map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => {
                        mapRef.current.flyTo([Number(item.lat), Number(item.lon)], 14, {
                          duration: 1.5,
                        })
                        setOpenMenu(null)
                      }}
                      className="flex w-full items-center gap-2 border-b border-gray-50 px-3 py-2.5 text-left text-xs text-gray-700 last:border-0 hover:bg-gray-50"
                    >
                      <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                      <span className="truncate">{item.display_name}</span>
                    </button>
                  ))}
                  {placeResults.status === 'done' && !placeResults.items.length ? (
                    <p className="px-3 py-3 text-center text-xs text-gray-400">No places found.</p>
                  ) : null}
                  {placeResults.status === 'error' ? (
                    <p className="px-3 py-3 text-center text-xs text-red-500">
                      Place search failed. Try again.
                    </p>
                  ) : null}
                </div>
              </MenuPanel>
            ) : null}
          </div>

          <div className="relative">
            <ToolButton
              title="Filter fields"
              active={filterCount > 0}
              activeClass="bg-blue-500 text-white hover:bg-blue-600"
              badge={filterCount || null}
              onClick={() => toggleMenu('filter')}
            >
              <Filter className="h-3.5 w-3.5" />
            </ToolButton>
            {openMenu === 'filter' ? (
              <MenuPanel className="w-64 max-w-[calc(100vw-2rem)]">
                <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
                  <p className="text-xs font-bold text-gray-800">Filter fields</p>
                  {filterCount ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCrops(new Set())
                        setActiveFarming(new Set())
                      }}
                      className="text-[10px] font-semibold text-red-500 hover:text-red-700"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                {[
                  [
                    'Crop',
                    cropOptions,
                    activeCrops,
                    toggleInSet(setActiveCrops),
                    (v) => v,
                    'green',
                  ],
                  [
                    'Type of farming',
                    farmingOptions,
                    activeFarming,
                    toggleInSet(setActiveFarming),
                    formatEnumLabel,
                    'blue',
                  ],
                ].map(([title, options, active, toggle, label, tone]) =>
                  options.length ? (
                    <div key={title} className="border-b border-gray-50 px-3 py-2.5">
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-wide text-gray-400">
                        {title}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggle(option)}
                            className={clsx(
                              'rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize',
                              active.has(option)
                                ? tone === 'green'
                                  ? 'border-green-300 bg-green-100 text-green-700'
                                  : 'border-blue-300 bg-blue-100 text-blue-700'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300',
                            )}
                          >
                            {label(option)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
                <p className="bg-gray-50 px-3 py-2 text-center text-[10px] text-gray-400">
                  {filterCount ? `${filterCount} filter(s) active` : 'Showing all fields'}
                </p>
              </MenuPanel>
            ) : null}
          </div>

          <ToolButton
            title={showLabels ? 'Hide field labels' : 'Show field labels'}
            active={showLabels}
            activeClass="bg-purple-500 text-white hover:bg-purple-600"
            onClick={() => setShowLabels((v) => !v)}
          >
            <Tag className="h-3.5 w-3.5" />
          </ToolButton>

          <ToolButton
            title={clusterMode ? 'Exit cluster view' : 'Cluster view'}
            active={clusterMode}
            activeClass="bg-teal-500 text-white hover:bg-teal-600"
            onClick={() => setClusterMode((v) => !v)}
          >
            <MapPin className="h-3.5 w-3.5" />
          </ToolButton>

          <div className="relative">
            <ToolButton
              title="Measure"
              active={Boolean(measureMode)}
              activeClass="bg-amber-500 text-white hover:bg-amber-600"
              onClick={() => toggleMenu('measure')}
            >
              <Ruler className="h-3.5 w-3.5" />
            </ToolButton>
            {openMenu === 'measure' ? (
              <MenuPanel className="min-w-[140px]">
                {[
                  ['distance', 'Distance'],
                  ['area', 'Area'],
                ].map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setMeasure(measureMode === mode ? null : mode)}
                    className={clsx(
                      'block w-full border-b border-gray-100 px-3 py-2 text-left text-xs font-medium last:border-0',
                      measureMode === mode
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-gray-700 hover:bg-gray-50',
                    )}
                  >
                    {label}
                  </button>
                ))}
                {measureMode ? (
                  <button
                    type="button"
                    onClick={() => setMeasure(null)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" /> Clear
                  </button>
                ) : null}
              </MenuPanel>
            ) : null}
          </div>

          <div className="relative">
            <ToolButton title="Switch basemap" active={false} onClick={() => toggleMenu('basemap')}>
              <Layers className="h-3.5 w-3.5" />
            </ToolButton>
            {openMenu === 'basemap' ? (
              <MenuPanel className="min-w-[130px]">
                {Object.entries(BASEMAPS).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setBasemap(key)
                      setOpenMenu(null)
                    }}
                    className={clsx(
                      'block w-full px-3 py-2 text-left text-xs font-medium',
                      basemap === key
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50',
                    )}
                  >
                    {config.label}
                  </button>
                ))}
              </MenuPanel>
            ) : null}
          </div>

          <div className="relative">
            <ToolButton title="Export" active={false} onClick={() => toggleMenu('export')}>
              <Download className="h-3.5 w-3.5" />
            </ToolButton>
            {openMenu === 'export' ? (
              <MenuPanel className="min-w-[150px]">
                <button
                  type="button"
                  disabled={!visibleFields.length}
                  onClick={() => {
                    exportFieldsGeoJson(visibleFields)
                    setOpenMenu(null)
                  }}
                  className="block w-full px-3 py-2 text-left text-xs font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50"
                >
                  GeoJSON
                </button>
                <button
                  type="button"
                  disabled={!visibleFields.length}
                  onClick={() => {
                    exportFieldsCsv(visibleFields)
                    setOpenMenu(null)
                  }}
                  className="block w-full border-t border-gray-100 px-3 py-2 text-left text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  CSV
                </button>
              </MenuPanel>
            ) : null}
          </div>

          <ToolButton
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            active={false}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </ToolButton>
        </div>
      </div>

      <div className="absolute bottom-14 left-3 z-[1000] flex flex-col gap-1">
        <ToolButton title="Zoom in" active={false} onClick={() => mapRef.current.zoomIn()}>
          <ZoomIn className="h-3.5 w-3.5" />
        </ToolButton>
        <ToolButton title="Zoom out" active={false} onClick={() => mapRef.current.zoomOut()}>
          <ZoomOut className="h-3.5 w-3.5" />
        </ToolButton>
      </div>
      <div className="absolute bottom-3 left-3 z-[1000]">
        <ToolButton title="Fit all fields" active={false} onClick={fitAll}>
          <Crosshair className="h-3.5 w-3.5" />
        </ToolButton>
      </div>

      {visibleFields.length && !clusterMode ? (
        <div className="absolute bottom-3 left-14 z-[1000]">
          <button
            type="button"
            onClick={() => setLegendOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm hover:bg-black/65"
          >
            Legend
            {legendOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>
          {legendOpen ? (
            <div className="absolute bottom-8 left-0 w-44 rounded-xl border border-gray-100 bg-white/95 p-2 shadow-xl">
              {visibleFields.slice(0, LEGEND_LIMIT).map((field) => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => selectField(field.id)}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left hover:bg-gray-50',
                    field.id === selectedId && 'bg-green-50',
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: colorById.get(field.id) }}
                  />
                  <span className="flex-1 truncate text-[10px] text-gray-700">
                    {field.fieldName}
                  </span>
                </button>
              ))}
              {visibleFields.length > LEGEND_LIMIT ? (
                <p className="mt-1 text-center text-[9px] text-gray-400">
                  +{visibleFields.length - LEGEND_LIMIT} more — use Fields to browse
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {fields.length ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2">
          <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
            <span className="font-bold">
              {visibleFields.length}
              {filterCount ? <span className="text-white/60"> / {fields.length}</span> : null}{' '}
              fields
            </span>
            <span className="text-white/30">·</span>
            <span>{totalAcres.toFixed(1)} ac</span>
            <span className="text-white/30">·</span>
            <span>{(totalAcres * 0.404686).toFixed(1)} ha</span>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="absolute left-1/2 top-16 z-[1001] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-gray-700 shadow">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-primary" />
          {load.totalFarmers
            ? `Loading farms · ${load.loadedFarmers}/${load.totalFarmers} farmers`
            : 'Loading farmers…'}
        </div>
      ) : null}

      {load.done && (load.error || load.failedFarmers > 0) ? (
        <div className="absolute left-1/2 top-16 z-[1001] -translate-x-1/2 rounded-full bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700 shadow">
          {load.error ||
            `Fields for ${load.failedFarmers} farmer${load.failedFarmers === 1 ? '' : 's'} could not be loaded.`}
        </div>
      ) : null}

      {load.done && !load.error && !fields.length ? (
        <div className="pointer-events-none absolute inset-0 z-[999] flex items-center justify-center">
          <div className="rounded-2xl bg-white/85 px-6 py-4 text-center backdrop-blur-sm">
            <Navigation className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm font-semibold text-gray-600">No mapped farms yet</p>
            <p className="text-xs text-gray-500">Farmer fields with boundaries will appear here.</p>
          </div>
        </div>
      ) : null}

      {measureMode ? (
        <div className="absolute left-1/2 top-16 z-[1001] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/75 px-4 py-1.5 text-[11px] font-medium text-white shadow-lg">
          <Ruler className="h-3 w-3 shrink-0" />
          {measureDone ? (
            <span className="font-bold text-amber-300">{measureResult || 'Not enough points'}</span>
          ) : (
            <>
              Click to add points · double-click to finish
              {measureResult ? (
                <span className="font-bold text-amber-300">{measureResult}</span>
              ) : null}
            </>
          )}
          <button
            type="button"
            onClick={() => setMeasure(null)}
            className="ml-1 hover:text-amber-200"
            aria-label="Clear measurement"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}

      {cursor ? (
        <div className="pointer-events-none absolute bottom-9 right-3 z-[1000] rounded bg-black/55 px-2 py-0.5 font-mono text-[9px] text-white">
          {cursor.lat.toFixed(5)}, {cursor.lng.toFixed(5)}
        </div>
      ) : null}

      {selectedField ? (
        <div className="absolute bottom-14 right-3 z-[1000] w-[260px] max-w-[calc(100%-1.5rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
          <div
            className="flex items-start justify-between px-4 py-3"
            style={{ background: selectedColor }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{selectedField.fieldName}</p>
              <p className="truncate text-[10px] text-white/80">
                {selectedField.cropLabel}
                {selectedField.variety ? ` · ${selectedField.variety}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="px-4 pb-2 pt-3">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
                <User className="h-3.5 w-3.5 text-green-700" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-gray-800">
                  {selectedField.owner.name}
                </span>
                <span className="block text-[10px] text-gray-500">{selectedField.owner.phone}</span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 px-4 pb-2">
            {[
              ['Area', `${selectedField.acre.toFixed(2)} ac`, 'bg-green-50 text-green-700'],
              ['Hectares', `${selectedField.hectare.toFixed(2)} ha`, 'bg-blue-50 text-blue-700'],
              ['Perimeter', formatLength(selectedField.perimeterM), 'bg-amber-50 text-amber-700'],
            ].map(([label, value, cls]) => (
              <div key={label} className={clsx('rounded-lg px-1.5 py-1.5 text-center', cls)}>
                <p className="text-[9px] text-gray-400">{label}</p>
                <p className="text-[10px] font-bold leading-tight">{value}</p>
              </div>
            ))}
          </div>
          <dl className="space-y-1 px-4 pb-2 text-xs">
            {[
              [
                selectedField.isBarrenLand ? 'Expected sowing' : 'Sowing',
                formatFieldDate(selectedField.sowingDate),
              ],
              ['Irrigation', selectedField.irrigationLabel],
              ['Farming', selectedField.farmingLabel],
              [
                'Subscription',
                selectedField.subscribed ? selectedField.planName || 'Active' : 'None',
              ],
              ['Vertices', `${selectedField.latLngs.length} pts`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2">
                <dt className="text-gray-400">{label}</dt>
                <dd className="truncate font-medium text-gray-700">{value || '—'}</dd>
              </div>
            ))}
          </dl>
          <div className="px-4 pb-3">
            <button
              type="button"
              onClick={() =>
                navigate(`/farmers/${selectedField.owner.id}`, {
                  state: { fieldId: selectedField.id },
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-white hover:opacity-90"
              style={{ background: selectedColor }}
            >
              <ExternalLink className="h-3.5 w-3.5" /> View farmer profile
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
