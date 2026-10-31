import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  formatCredits,
  formatDate,
  formatInrMinor,
  PURCHASE_STATUS_STYLES,
} from '@/lib/clientCredits'

const TH = 'px-5 py-3.5'
const TD = 'px-5 py-3.5 text-sm'

function Panel({ title, subtitle, children, action }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Table({ columns, children, empty, isEmpty }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {columns.map((col) => (
              <th key={col} className={TH}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {isEmpty ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-gray-500">
                {empty}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}

export function CreditStatCard({ label, value, hint, tone = 'default' }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p
        className={clsx(
          'mt-1 text-2xl font-bold',
          tone === 'warn' ? 'text-amber-600' : tone === 'bad' ? 'text-red-600' : 'text-gray-900',
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  )
}

export function CreditMeter({ used, total }) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className={clsx(
          'h-full rounded-full transition-all',
          pct >= 90 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-brand-primary',
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function CreditSummary({ summary }) {
  if (!summary) return null
  const remaining = summary.remainingCredits
  const lowTone =
    summary.totalCredits > 0 && remaining / summary.totalCredits < 0.1
      ? 'bad'
      : summary.totalCredits > 0 && remaining / summary.totalCredits < 0.25
        ? 'warn'
        : 'default'
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CreditStatCard
          label="Credits left"
          value={`${formatCredits(remaining)} ha`}
          hint={`of ${formatCredits(summary.totalCredits)} ha in active plans`}
          tone={summary.hasActivePlan ? lowTone : 'bad'}
        />
        <CreditStatCard
          label="Credits used"
          value={`${formatCredits(summary.usedCredits)} ha`}
          hint={`${formatCredits(summary.lifetimeCreditsUsed)} ha used in total`}
        />
        <CreditStatCard
          label="Farms unlocked"
          value={summary.farmsActivated}
          hint={`${summary.farmersServed} farmer${summary.farmersServed === 1 ? '' : 's'}`}
        />
        <CreditStatCard
          label="Next expiry"
          value={summary.nextExpiry ? formatDate(summary.nextExpiry) : '—'}
          hint={
            summary.activePools
              ? `${summary.activePools} active plan${summary.activePools === 1 ? '' : 's'}`
              : 'No active plan'
          }
        />
      </div>
      {summary.totalCredits > 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
            <span>Usage of active credits</span>
            <span className="font-medium text-gray-700">
              {formatCredits(summary.usedCredits)} / {formatCredits(summary.totalCredits)} ha
            </span>
          </div>
          <CreditMeter used={summary.usedCredits} total={summary.totalCredits} />
        </div>
      ) : null}
    </div>
  )
}

export function PurchaseStatusBadge({ status }) {
  const style = PURCHASE_STATUS_STYLES[status] || PURCHASE_STATUS_STYLES.pending
  return (
    <span className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', style.className)}>
      {style.label}
    </span>
  )
}

export function PurchasesPanel({ purchases = [] }) {
  return (
    <Panel title="Purchase history" subtitle="Each paid plan is a separate credit pool">
      <Table
        columns={['Plan', 'Credits', 'Used', 'Amount', 'Paid on', 'Valid until', 'Status']}
        isEmpty={purchases.length === 0}
        empty="No plans bought yet."
      >
        {purchases.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50/60">
            <td className={clsx(TD, 'font-semibold text-gray-900')}>{p.planName}</td>
            <td className={TD}>{formatCredits(p.totalCredits)} ha</td>
            <td className={clsx(TD, 'min-w-[140px]')}>
              <p className="mb-1 text-xs text-gray-500">
                {formatCredits(p.usedCredits)} ha · {formatCredits(p.remainingCredits)} left
              </p>
              <CreditMeter used={p.usedCredits} total={p.totalCredits} />
            </td>
            <td className={TD}>{formatInrMinor(p.amountMinor)}</td>
            <td className={clsx(TD, 'text-gray-600')}>{formatDate(p.paidAt)}</td>
            <td className={clsx(TD, 'text-gray-600')}>{formatDate(p.validUntil)}</td>
            <td className={TD}>
              <PurchaseStatusBadge status={p.status} />
            </td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

export function UsageByFarmerPanel({ rows = [], onSelectFarmer, selectedFarmerId }) {
  return (
    <Panel title="Usage by farmer" subtitle="Credits used by each farmer's farms">
      <Table
        columns={['Farmer', 'Phone', 'Farms', 'Credits used', 'Last farm added']}
        isEmpty={rows.length === 0}
        empty="No farms have used credits yet."
      >
        {rows.map((r) => (
          <tr
            key={r.farmerId}
            onClick={onSelectFarmer ? () => onSelectFarmer(r.farmerId) : undefined}
            className={clsx(
              'hover:bg-gray-50/60',
              onSelectFarmer && 'cursor-pointer',
              selectedFarmerId === r.farmerId && 'bg-[#E7EFEC]/60',
            )}
          >
            <td className={clsx(TD, 'font-semibold text-gray-900')}>{r.name}</td>
            <td className={clsx(TD, 'text-gray-600')}>{r.phone || '—'}</td>
            <td className={TD}>{r.farms}</td>
            <td className={clsx(TD, 'font-semibold text-gray-900')}>
              {formatCredits(r.credits)} ha
            </td>
            <td className={clsx(TD, 'text-gray-600')}>{formatDate(r.lastUsedAt)}</td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

const REASON_LABELS = {
  farm_activation: 'Farm added',
  area_increase: 'Farm area increased',
}

export function UsageLedgerPanel({
  transactions = [],
  pagination,
  loading,
  onPageChange,
  farmerFilterName,
  onClearFilter,
}) {
  const page = pagination?.page || 1
  const totalPages = pagination?.totalPages || 1
  return (
    <Panel
      title="Credit activity"
      subtitle={
        farmerFilterName
          ? `Showing ${farmerFilterName} only`
          : 'Every deduction, newest first'
      }
      action={
        farmerFilterName && onClearFilter ? (
          <button
            type="button"
            onClick={onClearFilter}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-primary hover:bg-[#E7EFEC]"
          >
            Show all farmers
          </button>
        ) : null
      }
    >
      <Table
        columns={['Date', 'Farmer', 'Farm', 'Farm size', 'Event', 'Credits']}
        isEmpty={!loading && transactions.length === 0}
        empty="No credit activity yet."
      >
        {loading ? (
          <tr>
            <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-500">
              Loading…
            </td>
          </tr>
        ) : (
          transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50/60">
              <td className={clsx(TD, 'text-gray-600')}>{formatDate(t.createdAt)}</td>
              <td className={clsx(TD, 'font-medium text-gray-900')}>
                {t.farmer?.name || '—'}
                {t.farmer?.phone ? (
                  <span className="block text-xs font-normal text-gray-400">{t.farmer.phone}</span>
                ) : null}
              </td>
              <td className={TD}>{t.fieldName}</td>
              <td className={clsx(TD, 'text-gray-600')}>
                {formatCredits(t.fieldHectares)} ha
                <span className="block text-xs text-gray-400">{formatCredits(t.fieldAcres)} acres</span>
              </td>
              <td className={clsx(TD, 'text-gray-600')}>{REASON_LABELS[t.reason] || t.reason}</td>
              <td className={clsx(TD, 'font-semibold text-red-600')}>
                −{formatCredits(t.credits)}
              </td>
            </tr>
          ))
        )}
      </Table>
      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          <span>
            Page {page} of {totalPages} · {pagination.total} entries
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </Panel>
  )
}
