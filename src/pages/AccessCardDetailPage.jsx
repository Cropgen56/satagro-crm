import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import ProductAccessCard from '@/components/subscriptions/ProductAccessCard'
import {
  fetchAccessCardById,
  fetchAccessCardEvents,
  getCachedCardCode,
} from '@/lib/accessCards'
import { DEFAULT_PRODUCT_NAME } from '@/lib/productCardConfig'
import { ArrowLeft, Printer } from 'lucide-react'
import clsx from 'clsx'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_STYLES = {
  unused: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  redeemed: 'bg-blue-50 text-blue-700 ring-blue-200',
  revoked: 'bg-red-50 text-red-700 ring-red-200',
  expired: 'bg-gray-100 text-gray-600 ring-gray-200',
}

const EVENT_LABELS = {
  batch_created: 'Batch created',
  exported: 'Exported for printing',
  redeemed: 'Redeemed by farmer',
  acres_allocated: 'Acres allocated to field',
  subscription_activated: 'Field subscription activated',
  hybrid_payment: 'Hybrid Razorpay payment',
  revoked: 'Revoked by admin',
  expired: 'Card expired',
  entitlement_expired: 'Entitlement expired',
}

export default function AccessCardDetailPage() {
  const { id } = useParams()
  const [card, setCard] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cachedCode, setCachedCode] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [cardRes, eventsRes] = await Promise.all([
        fetchAccessCardById(id),
        fetchAccessCardEvents(id),
      ])
      setCard(cardRes?.data || null)
      setEvents(eventsRes?.data || [])
      setCachedCode(getCachedCardCode(id))
    } catch (err) {
      setError(err.message || 'Failed to load card')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const displayCode = useMemo(() => {
    if (cachedCode?.code) return cachedCode.code
    return card?.codePrefix || null
  }, [cachedCode, card?.codePrefix])

  const hasFullCode = Boolean(cachedCode?.code)
  const productName =
    card?.batchId?.productName?.trim() || DEFAULT_PRODUCT_NAME

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <p className="p-8 text-sm text-gray-500">Loading card…</p>
  }

  if (error || !card) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error || 'Card not found'}</p>
        <Link
          to="/subscriptions/cards"
          className="mt-4 inline-block text-sm text-brand-primary"
        >
          Back to cards
        </Link>
      </div>
    )
  }

  const farmer = card.redeemedBy
  const usage = card.usage || {
    totalAcres: card.acreLimit,
    usedAcres: 0,
    remainingAcres: card.acreLimit,
    pendingAdminAcres: 0,
    fieldAllocations: [],
  }

  const formatAcres = (value) => {
    const n = Number(value)
    if (!Number.isFinite(n)) return '—'
    return `${n.toFixed(2)} ac`
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <Link
        to="/subscriptions/cards"
        className="no-print mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cards
      </Link>

      <PageTopBar />

      <header className="no-print mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-primary">
              Card detail
            </h1>
            <span
              className={clsx(
                'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1',
                STATUS_STYLES[card.status] || STATUS_STYLES.unused,
              )}
            >
              {card.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {card.batchId?.label || 'BioDrops access card'}
            {displayCode ? (
              <>
                {' '}
                ·{' '}
                <span className="font-mono text-gray-700">{displayCode}</span>
              </>
            ) : null}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3d7a14] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d5010]"
        >
          <Printer className="h-4 w-4" />
          Print card
        </button>
      </header>

      {/* Printable product card */}
      <section className="no-print mt-8">
        <div className="mx-auto max-w-[820px]">
          <ProductAccessCard
            code={displayCode}
            qrUrl={cachedCode?.qrUrl}
            qrLocked={!hasFullCode}
            productName={productName}
            acreLimit={card.acreLimit}
            durationMonths={card.durationMonths}
          />
        </div>

        {!hasFullCode ? (
          <p className="mx-auto mt-3 max-w-[820px] text-center text-xs text-amber-800">
            Full unlock code and QR are only available from the batch generation
            screen or CSV in this browser session. Regenerate or use your saved
            CSV to print scannable cards.
          </p>
        ) : null}
      </section>

      <div className="no-print mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Total limit
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatAcres(usage.totalAcres)}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Used
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-900">
            {formatAcres(usage.usedAcres)}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
            Remaining on card
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-900">
            {formatAcres(usage.remainingAcres)}
          </p>
        </div>
      </div>

      {usage.pendingAdminAcres > 0 ? (
        <div className="no-print mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">
            {formatAcres(usage.pendingAdminAcres)}
          </span>{' '}
          applied to fields but awaiting CRM admin approval before unlock.
        </div>
      ) : null}

      <div className="no-print mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-900">Card information</h3>
          <dl className="mt-4 space-y-4 text-sm">
            {[
              ['Status', card.status],
              ['Card code', displayCode || '—'],
              ['Plan', card.planId?.name || '—'],
              ['Acre limit', `${card.acreLimit} acres`],
              ['Acres used', formatAcres(usage.usedAcres)],
              ['Acres remaining', formatAcres(usage.remainingAcres)],
              [
                'Entitlement status',
                usage.entitlementStatus || (card.status === 'unused' ? 'not redeemed' : '—'),
              ],
              ['Entitlement valid until', formatDate(usage.validUntil)],
              ['Duration', `${card.durationMonths} months`],
              ['Product', productName],
              ['Batch', card.batchId?.label || '—'],
              ['Card expires', formatDate(card.redeemBy)],
              ['Redeemed at', formatDateTime(card.redeemedAt)],
              ['Created', formatDateTime(card.createdAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="mt-0.5 font-medium capitalize text-gray-900">
                  {label === 'Card code' ? (
                    <span className="font-mono normal-case">{value}</span>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {farmer ? (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500">Redeemed by</p>
              <p className="mt-1 font-medium text-gray-900">
                {[farmer.firstName, farmer.lastName].filter(Boolean).join(' ') ||
                  '—'}
              </p>
              <p className="text-sm text-gray-600">
                {farmer.phone || farmer.email}
              </p>
              <Link
                to={`/farmers/${farmer._id}`}
                className="mt-2 inline-block text-sm text-brand-primary hover:underline"
              >
                View farmer
              </Link>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-gray-900">Field allocations</h3>
          {usage.fieldAllocations?.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No fields have used this card yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Farmer</th>
                    <th className="px-3 py-2">From card</th>
                    <th className="px-3 py-2">Pending approval</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usage.fieldAllocations.map((row) => (
                    <tr key={row.subscriptionId}>
                      <td className="px-3 py-3">
                        <p className="font-medium text-gray-900">
                          {row.fieldName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatAcres(row.fieldAcres)} total
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        {row.farmer ? (
                          <Link
                            to={`/farmers/${row.farmer.id}`}
                            className="text-brand-primary hover:underline"
                          >
                            {row.farmer.name}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-3">{formatAcres(row.cardAcres)}</td>
                      <td className="px-3 py-3">
                        {row.pendingAdminAcres > 0 ? (
                          <span className="font-medium text-amber-700">
                            {formatAcres(row.pendingAdminAcres)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-3 capitalize text-gray-700">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3 className="mt-8 font-semibold text-gray-900">Activity timeline</h3>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No events recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {events.map((ev) => (
                <li key={ev._id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {EVENT_LABELS[ev.eventType] || ev.eventType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(ev.createdAt)}
                    </p>
                    {ev.metadata && Object.keys(ev.metadata).length > 0 ? (
                      <pre className="mt-1 overflow-x-auto rounded bg-gray-50 p-2 text-[10px] text-gray-600">
                        {JSON.stringify(ev.metadata, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Print-only single card */}
      <div className="print-only-sheet" aria-hidden>
        <div className="product-access-card-page">
          <ProductAccessCard
            forPrint
            code={displayCode}
            qrUrl={cachedCode?.qrUrl}
            qrLocked={!hasFullCode}
            productName={productName}
            acreLimit={card.acreLimit}
            durationMonths={card.durationMonths}
          />
        </div>
      </div>
    </div>
  )
}
