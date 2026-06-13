import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { CreditCard } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { fetchFarmerAccessCards } from '@/lib/accessCards'

const STATUS_STYLES = {
  unused: 'bg-emerald-50 text-emerald-700',
  redeemed: 'bg-blue-50 text-blue-700',
  revoked: 'bg-red-50 text-red-600',
  expired: 'bg-gray-100 text-gray-600',
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatAcres(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return `${n.toFixed(2)} ac`
}

export default function ProductCardsTab({ farmer }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!farmer?.id) return
    try {
      setLoading(true)
      setError('')
      const res = await fetchFarmerAccessCards(farmer.id)
      setRows(res?.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load product cards')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [farmer?.id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center text-sm text-gray-500 shadow-sm">
        Loading product cards...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <EmptyState
          icon={CreditCard}
          title="No product cards redeemed"
          description="When this farmer scans a BioDrops kit card, it will appear here with acre usage and field allocations."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {rows.map((card) => {
        const usage = card.usage || {}
        return (
          <div
            key={card.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-mono text-sm font-semibold text-gray-900">
                    {card.codePrefix}
                  </h3>
                  <span
                    className={clsx(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      STATUS_STYLES[card.status] || STATUS_STYLES.redeemed,
                    )}
                  >
                    {card.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {card.batch?.label || 'BioDrops card'}
                  {card.batch?.productName
                    ? ` · ${card.batch.productName}`
                    : ''}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Redeemed {formatDate(card.redeemedAt)} · {card.durationMonths}{' '}
                  months
                </p>
              </div>
              <Link
                to={`/subscriptions/cards/${card.id}`}
                className="text-sm font-semibold text-brand-primary hover:underline"
              >
                View card
              </Link>
            </div>

            <div className="grid gap-4 px-5 py-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500">Total limit</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatAcres(usage.totalAcres ?? card.acreLimit)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Used</p>
                <p className="mt-1 font-semibold text-emerald-700">
                  {formatAcres(usage.usedAcres)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Remaining</p>
                <p className="mt-1 font-semibold text-blue-700">
                  {formatAcres(usage.remainingAcres)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending approval</p>
                <p className="mt-1 font-semibold text-amber-700">
                  {usage.pendingAdminAcres > 0
                    ? formatAcres(usage.pendingAdminAcres)
                    : '—'}
                </p>
              </div>
            </div>

            {usage.fieldAllocations?.length > 0 ? (
              <div className="border-t border-gray-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Fields using this card
                </p>
                <div className="mt-3 space-y-2">
                  {usage.fieldAllocations.map((row) => (
                    <div
                      key={row.subscriptionId}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {row.fieldName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatAcres(row.fieldAcres)} field ·{' '}
                          {formatAcres(row.cardAcres)} from card
                          {row.pendingAdminAcres > 0
                            ? ` · ${formatAcres(row.pendingAdminAcres)} pending`
                            : ''}
                        </p>
                      </div>
                      <span className="text-xs capitalize text-gray-600">
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
