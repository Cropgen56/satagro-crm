import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EmptyState from '@/components/ui/EmptyState'
import ProductAccessCard from '@/components/subscriptions/ProductAccessCard'
import { fetchAccessCards } from '@/lib/accessCards'
import { CARD_PRINT, DEFAULT_PRODUCT_NAME } from '@/lib/productCardConfig'
import { CreditCard, Plus, Printer } from 'lucide-react'
import clsx from 'clsx'

const STATUS_STYLES = {
  unused: 'bg-emerald-50 text-emerald-700',
  redeemed: 'bg-blue-50 text-blue-700',
  revoked: 'bg-red-50 text-red-700',
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

export default function AccessCardsPage() {
  const [cards, setCards] = useState([])
  const [pagination, setPagination] = useState({})
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        setError('')
        const res = await fetchAccessCards({
          page,
          limit: 25,
          ...(status ? { status } : {}),
        })
        setCards(res?.data || [])
        setPagination(res?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load cards')
        setCards([])
      } finally {
        setLoading(false)
      }
    },
    [status],
  )

  useEffect(() => {
    load(1)
  }, [load])

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <header className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary">
          Product cards
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Printable BioDrops kit cards with QR unlock codes — track redemption and
          status
        </p>
      </header>

      {/* Card template showcase */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[#d4edcc] bg-gradient-to-br from-[#f4faf0] via-white to-[#f8fdf6] shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_minmax(280px,420px)] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e0] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#3d7a14]">
              <Printer className="h-3 w-3" />
              {CARD_PRINT.format}
            </p>
            <h2 className="mt-3 text-lg font-bold text-gray-900">
              Bokashi bucket product card
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Each generated card includes a unique QR code bound to its unlock
              code (<code className="text-xs">satagro://unlock?code=…</code>).
              Farmers scan to unlock precision-farming access in the BioDrops app.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
              <li>• {CARD_PRINT.widthMm}×{CARD_PRINT.heightMm} mm — farmer meetings &amp; dealer kits</li>
              <li>• Product photo, benefits, app acre/month entitlement</li>
              <li>• Print-ready batch export with CSV backup</li>
            </ul>
            <Link
              to="/subscriptions/cards/generate"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#3d7a14] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2d5010]"
            >
              <Plus className="h-4 w-4" />
              Generate cards with QR
            </Link>
          </div>
          <div className="mx-auto w-full max-w-[420px]">
            <ProductAccessCard
              code="BD-****-****"
              productName={DEFAULT_PRODUCT_NAME}
              acreLimit={5}
              durationMonths={12}
              compact
            />
            <p className="mt-2 text-center text-[10px] text-gray-400">
              Template preview — codes are unique per card
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['', 'unused', 'redeemed', 'revoked', 'expired'].map((s) => (
            <button
              key={s || 'all'}
              type="button"
              onClick={() => setStatus(s)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                status === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50',
              )}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
            </button>
          ))}
        </div>

        <Link
          to="/subscriptions/cards/generate"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950"
        >
          <Plus className="h-4 w-4" />
          Generate cards
        </Link>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading cards…</p>
        ) : cards.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={CreditCard}
              title="No cards yet"
              description="Generate a batch of printable product cards with QR codes for BioDrops kits."
            />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#FAFAFA] text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-3">Card</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Acres</th>
                <th className="px-4 py-3">Used / left</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Redeemed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr
                  key={card._id}
                  className="border-b border-gray-50 hover:bg-gray-50/80"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-800">
                    {card.codePrefix || 'BD-****'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {card.batchId?.productName || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {card.planId?.name || '—'}
                  </td>
                  <td className="px-4 py-3">{card.acreLimit}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {card.usage
                      ? `${Number(card.usage.usedAcres || 0).toFixed(2)} / ${Number(card.usage.remainingAcres || card.acreLimit).toFixed(2)}`
                      : '—'}
                    {card.usage?.pendingAdminAcres > 0 ? (
                      <p className="text-xs text-amber-700">
                        {Number(card.usage.pendingAdminAcres).toFixed(2)} pending
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{card.durationMonths} mo</td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                        STATUS_STYLES[card.status] || STATUS_STYLES.unused,
                      )}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(card.redeemedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/subscriptions/cards/${card._id}`}
                      className="text-sm font-medium text-brand-primary hover:underline"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.total > pagination.limit ? (
        <p className="mt-3 text-xs text-gray-500">
          Showing {cards.length} of {pagination.total} cards
        </p>
      ) : null}
    </div>
  )
}
