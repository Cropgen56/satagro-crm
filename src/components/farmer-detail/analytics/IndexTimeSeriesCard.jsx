import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import useAsyncData from '@/hooks/useAsyncData'
import { fetchIndexTimeSeries, toRing } from '@/lib/farmAnalytics'

function isoDaysAgo(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function formatAxisDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

export default function IndexTimeSeriesCard({ field, family, title, options, color }) {
  const [index, setIndex] = useState(options[0][0])
  const ring = useMemo(() => toRing(field?.field), [field?.field])
  const [range] = useState(() => ({ start: isoDaysAgo(365), end: isoDaysAgo(0) }))

  const query = useAsyncData(
    ring.length >= 4 ? `${family}:${field._id}:${index}:${range.start}` : null,
    (signal) =>
      fetchIndexTimeSeries(
        { ring, startDate: range.start, endDate: range.end, index, family },
        { signal },
      ),
  )

  const points = useMemo(() => query.data?.points || [], [query.data])

  const stats = useMemo(() => {
    if (!points.length) return null
    const values = points.map((p) => p.value)
    const apiSummary = query.data?.summary
    const pick = (key, fallback) =>
      Number.isFinite(Number(apiSummary?.[key])) ? Number(apiSummary[key]) : fallback
    const latest = points[points.length - 1]
    const previous = points.length > 1 ? points[points.length - 2] : null
    return {
      min: pick('min', Math.min(...values)),
      max: pick('max', Math.max(...values)),
      mean: pick('mean', values.reduce((s, v) => s + v, 0) / values.length),
      latest,
      change: previous ? latest.value - previous.value : null,
      daysAgo: Math.max(
        0,
        Math.floor((Date.now() - new Date(`${latest.date}T12:00:00`).getTime()) / 86400000),
      ),
    }
  }, [points, query.data])

  const description = options.find(([value]) => value === index)?.[1]

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <select
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
        >
          {options.map(([value]) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Latest {index}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats ? stats.latest.value.toFixed(3) : '—'}
          </p>
          {stats?.change != null ? (
            <span
              className={clsx(
                'mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold',
                stats.change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
              )}
            >
              {stats.change >= 0 ? '+' : ''}
              {stats.change.toFixed(3)} vs previous pass
            </span>
          ) : null}
          <p className="mt-2 text-xs text-gray-500">
            {stats
              ? `Last pass ${stats.daysAgo === 0 ? 'today' : `${stats.daysAgo} day${stats.daysAgo === 1 ? '' : 's'} ago`}`
              : 'No passes yet'}
          </p>
          {stats ? (
            <dl className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
              {[
                ['Min', stats.min],
                ['Mean', stats.mean],
                ['Max', stats.max],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-semibold text-gray-800">{value.toFixed(3)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {description ? <p className="mt-3 text-xs text-gray-500">{description}</p> : null}
        </div>

        <div className="h-[240px] lg:col-span-3">
          {query.loading ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading {index} history…
            </div>
          ) : query.error ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-red-600">
              {query.error}
            </div>
          ) : !points.length ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
              No {index} data found for this field in the last 12 months.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatAxisDate}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  minTickGap={24}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickFormatter={(v) => v.toFixed(2)}
                  width={44}
                />
                <Tooltip
                  labelFormatter={(label) => formatAxisDate(label)}
                  formatter={(value) => [Number(value).toFixed(3), index]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: color }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
