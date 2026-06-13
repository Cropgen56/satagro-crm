import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { Building2, Calendar, CheckCircle2, Shield } from 'lucide-react'
import {
  activateFarmerSubscription,
  approveCardRemainder,
  cancelFarmerSubscription,
  fetchFarmerSubscriptions,
} from '@/lib/subscriptions'
import { fetchSubscriptionPlans } from '@/lib/subscriptionPlans'

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  expired: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-50 text-red-600',
}

const SOURCE_LABELS = {
  razorpay: 'Razorpay',
  product_card: 'Product card',
  hybrid: 'Card + Razorpay',
  admin: 'Enterprise (Admin)',
}

const BILLING_CYCLES = [
  { value: 'monthly', label: 'Monthly (30 days)' },
  { value: 'yearly', label: 'Yearly (365 days)' },
  { value: 'season', label: 'Season (120 days)' },
]

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function daysRemaining(endDate) {
  if (!endDate) return null
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
}

export default function SubscriptionTab({ farmer, onUpdated }) {
  const [rows, setRows] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    farmId: '',
    planId: '',
    billingCycle: 'yearly',
  })
  const [submitting, setSubmitting] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [approvingId, setApprovingId] = useState(null)
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    if (!farmer?.id) return
    try {
      setLoading(true)
      setError('')
      const [subsRes, plansRes] = await Promise.all([
        fetchFarmerSubscriptions(farmer.id),
        fetchSubscriptionPlans('mobile'),
      ])
      setRows(subsRes?.data || [])
      setPlans((plansRes?.data || []).filter((p) => p.active !== false))
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [farmer?.id])

  useEffect(() => {
    load()
  }, [load])

  const activeCount = useMemo(
    () => rows.filter((r) => r.status === 'active').length,
    [rows],
  )

  const activeSubByFieldId = useMemo(() => {
    const map = new Map()
    for (const row of rows) {
      if (row.status === 'active' && row.field?.id) {
        map.set(row.field.id, row)
      }
    }
    return map
  }, [rows])

  useEffect(() => {
    if (!farmer?.fields?.length || loading) return

    const firstWithoutSub = farmer.fields.find(
      (field) => !activeSubByFieldId.has(field.id),
    )
    const preferredId = firstWithoutSub?.id || farmer.fields[0]?.id
    if (!preferredId) return

    setForm((prev) => {
      const currentHasActive = prev.farmId && activeSubByFieldId.has(prev.farmId)
      if (!prev.farmId || currentHasActive) {
        return { ...prev, farmId: preferredId }
      }
      return prev
    })
  }, [farmer?.fields, loading, activeSubByFieldId])

  useEffect(() => {
    if (!form.planId && plans.length) {
      setForm((prev) => ({ ...prev, planId: plans[0]._id }))
    }
  }, [plans, form.planId])

  const selectedFieldHasActiveSub = Boolean(
    form.farmId && activeSubByFieldId.has(form.farmId),
  )

  const pendingRemainderRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.status === 'pending' &&
          row.activationSource === 'hybrid' &&
          row.subscriptionPhase === 'card_remainder_pending' &&
          (row.pendingAdminAcres || 0) > 0,
      ),
    [rows],
  )

  const pendingPaymentRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.status === 'pending' &&
          row.subscriptionPhase === 'card_payment_pending',
      ),
    [rows],
  )

  const handleApproveRemainder = async (subscriptionId) => {
    if (
      !window.confirm(
        'Approve the remaining acres from the product card? The field will unlock for this farmer.',
      )
    ) {
      return
    }
    try {
      setApprovingId(subscriptionId)
      setError('')
      setSuccess('')
      await approveCardRemainder(subscriptionId)
      setSuccess('Remaining acres approved. Field is now unlocked.')
      await load()
      onUpdated?.()
    } catch (err) {
      setError(err.message || 'Failed to approve remainder')
    } finally {
      setApprovingId(null)
    }
  }

  const handleActivate = async (e) => {
    e.preventDefault()
    if (!form.farmId || !form.planId || !form.billingCycle) return
    try {
      setSubmitting(true)
      setError('')
      setSuccess('')
      await activateFarmerSubscription(farmer.id, form)
      setSuccess('Enterprise subscription enabled. The field is now unlocked for this farmer.')
      await load()
      onUpdated?.()
    } catch (err) {
      setError(err.message || 'Failed to enable subscription')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (subscriptionId) => {
    if (!window.confirm('Cancel this subscription? The farmer may lose field access.')) {
      return
    }
    try {
      setCancellingId(subscriptionId)
      setError('')
      setSuccess('')
      await cancelFarmerSubscription(subscriptionId)
      setSuccess('Subscription cancelled.')
      await load()
      onUpdated?.()
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center text-sm text-gray-500 shadow-sm">
        Loading subscriptions...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Active subscriptions
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Farms registered
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {farmer.fieldCount || 0}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Total acreage
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {farmer.totalAcre > 0 ? `${farmer.totalAcre.toFixed(1)} ac` : '—'}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      {pendingPaymentRows.length > 0 ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900">
            Awaiting Razorpay payment ({pendingPaymentRows.length})
          </h3>
          <p className="mt-1 text-sm text-blue-800">
            These fields used a product card for partial coverage. The farmer
            must complete Razorpay payment for the remaining acres before the
            field unlocks.
          </p>
          <div className="mt-4 space-y-3">
            {pendingPaymentRows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm"
              >
                <p className="font-medium text-gray-900">
                  {row.field.name} — {row.field.acres.toFixed(2)} ac total
                </p>
                <p className="text-xs text-gray-600">
                  {row.cardAcres} ac from card · {row.paidAcres || 0} ac to pay
                  via Razorpay
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {pendingRemainderRows.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-amber-900">
            Card remainder approval needed ({pendingRemainderRows.length})
          </h3>
          <p className="mt-1 text-sm text-amber-800">
            These farmers redeemed a product card that does not fully cover the field.
            Approve the remaining acres to unlock the field.
          </p>
          <div className="mt-4 space-y-3">
            {pendingRemainderRows.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {row.field.name} — {row.field.acres.toFixed(2)} ac total
                  </p>
                  <p className="text-xs text-gray-600">
                    {row.cardAcres} ac from card · {row.pendingAdminAcres} ac
                    awaiting approval
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApproveRemainder(row.id)}
                  disabled={approvingId === row.id}
                  className="rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
                >
                  {approvingId === row.id ? 'Approving...' : 'Approve remainder'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-brand-primary/20 bg-[#F7FAF9] p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10">
            <Building2 className="h-5 w-5 text-brand-primary" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">
              Enable enterprise subscription
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Grant field access without Razorpay payment — same as CropGen admin
              activation. Use internal plans for enterprise farmers.
            </p>
          </div>
        </div>

        {!farmer.fields?.length ? (
          <p className="mt-4 text-sm text-amber-700">
            This farmer has no farms yet. Add a field in the app before enabling a
            subscription.
          </p>
        ) : (
          <form onSubmit={handleActivate} className="mt-5 grid gap-4 lg:grid-cols-4">
            {selectedFieldHasActiveSub ? (
              <p className="lg:col-span-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                This field already has an active subscription. Choose a locked
                field (marked below) to unlock it in the app.
              </p>
            ) : null}
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Farm / field</span>
              <select
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                value={form.farmId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, farmId: e.target.value }))
                }
                required
              >
                {farmer.fields.map((field) => {
                  const activeSub = activeSubByFieldId.get(field.id)
                  const acreLabel =
                    field.acre > 0 ? `${field.acre.toFixed(2)} ac` : '—'
                  const statusLabel = activeSub
                    ? `Unlocked until ${formatDate(activeSub.endDate)}`
                    : 'Locked — no subscription'
                  return (
                    <option key={field.id} value={field.id}>
                      {field.fieldName} ({acreLabel}) — {statusLabel}
                    </option>
                  )
                })}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-gray-700">Plan</span>
              <select
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                value={form.planId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, planId: e.target.value }))
                }
                required
              >
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name}
                    {plan.isInternal ? ' (Internal)' : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-gray-700">Billing cycle</span>
              <select
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                value={form.billingCycle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, billingCycle: e.target.value }))
                }
                required
              >
                {BILLING_CYCLES.map((cycle) => (
                  <option key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting || !plans.length || selectedFieldHasActiveSub}
                className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
              >
                {submitting ? 'Enabling...' : 'Enable subscription'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Subscription history ({rows.length})
          </h3>
        </div>

        {!rows.length ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            No subscriptions yet for this farmer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3.5">Field</th>
                  <th className="px-5 py-3.5">Plan</th>
                  <th className="px-5 py-3.5">Cycle</th>
                  <th className="px-5 py-3.5">Source</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Period</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const daysLeft = daysRemaining(row.endDate)
                  return (
                    <tr key={row.id} className="text-gray-700">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{row.field.name}</p>
                        <p className="text-xs text-gray-500">
                          {row.acres > 0 ? `${row.acres} ac field` : '—'}
                          {row.cardAcres > 0
                            ? ` · ${row.cardAcres} ac card`
                            : ''}
                          {row.pendingAdminAcres > 0
                            ? ` · ${row.pendingAdminAcres} ac pending`
                            : ''}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p>{row.plan.name}</p>
                        {row.plan.isInternal ? (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs text-brand-primary">
                            <Shield className="h-3 w-3" />
                            Internal
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">{row.billingLabel}</td>
                      <td className="px-5 py-4">
                        {SOURCE_LABELS[row.activationSource] || row.activationSource}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={clsx(
                            'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                            STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-600',
                          )}
                        >
                          {row.status}
                        </span>
                        {row.status === 'active' && daysLeft != null ? (
                          <p className="mt-1 text-xs text-gray-500">
                            {daysLeft >= 0 ? `${daysLeft} days left` : 'Expired'}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <p className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(row.startDate)} → {formatDate(row.endDate)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {row.status === 'pending' &&
                        row.activationSource === 'hybrid' &&
                        row.subscriptionPhase === 'card_remainder_pending' &&
                        (row.pendingAdminAcres || 0) > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleApproveRemainder(row.id)}
                            disabled={approvingId === row.id}
                            className="text-xs font-semibold text-brand-primary hover:underline disabled:opacity-60"
                          >
                            {approvingId === row.id
                              ? 'Approving...'
                              : 'Approve remainder'}
                          </button>
                        ) : row.status === 'active' || row.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => handleCancel(row.id)}
                            disabled={cancellingId === row.id}
                            className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
                          >
                            {cancellingId === row.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
