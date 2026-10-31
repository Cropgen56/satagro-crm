import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import clsx from 'clsx'
import { ArrowLeft, Building2, Layers, Pencil, Plus, Power, Trash2, X } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmModal from '@/components/ui/ConfirmModal'
import {
  CreditMeter,
  CreditSummary,
  PurchasesPanel,
  UsageByFarmerPanel,
  UsageLedgerPanel,
} from '@/components/client-credits/ClientCreditPanels'
import { useAuth } from '@/hooks/useAuth'
import { fetchClients } from '@/lib/clients'
import { fetchSubscriptionPlans } from '@/lib/subscriptionPlans'
import {
  createClientCreditPlan,
  deleteClientCreditPlan,
  fetchClientCreditPlans,
  fetchClientCreditsDetail,
  fetchClientCreditsOverview,
  formatCredits,
  formatDate,
  formatInrMinor,
  formatValidity,
  updateClientCreditPlan,
} from '@/lib/clientCredits'

const INPUT =
  'h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 px-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15'

const EMPTY_FORM = {
  name: '',
  description: '',
  totalHectares: '',
  pricePerHectare: '',
  validityMonths: '12',
  featurePlanId: '',
  clientId: '',
  active: true,
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-xs text-gray-400">{hint}</span> : null}
    </label>
  )
}

function planToForm(plan) {
  return {
    name: plan.name,
    description: plan.description || '',
    totalHectares: String(plan.totalHectares),
    pricePerHectare: String(plan.pricePerHectareMinor / 100),
    validityMonths: String(plan.validityMonths),
    featurePlanId: plan.featurePlanId || '',
    clientId: plan.client?.id || '',
    active: plan.active,
  }
}

function PlanForm({ plan, featurePlans, clients, onSaved, onCancel }) {
  const [form, setForm] = useState(plan ? planToForm(plan) : EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const totalMinor = Math.round(
    (Number(form.totalHectares) || 0) * Math.round((Number(form.pricePerHectare) || 0) * 100),
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      const payload = {
        name: form.name,
        description: form.description,
        totalHectares: Number(form.totalHectares),
        pricePerHectareMinor: Math.round((Number(form.pricePerHectare) || 0) * 100),
        validityMonths: Number(form.validityMonths),
        featurePlanId: form.featurePlanId,
        clientId: form.clientId || null,
        active: form.active,
      }
      const res = plan
        ? await updateClientCreditPlan(plan.id, payload)
        : await createClientCreditPlan(payload)
      onSaved(res.plan, Boolean(plan))
    } catch (err) {
      setError(err.message || 'Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {plan ? 'Edit client plan' : 'New client plan'}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            1 credit = 1 hectare. After a client buys this plan, they activate each of their farmers'
            farms from their CRM, and the farm's hectares are deducted from their credits.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Plan name">
          <input className={INPUT} value={form.name} onChange={set('name')} required maxLength={120} placeholder="e.g. FPO 1000 ha" />
        </Field>
        <Field label="Offered to" hint="Leave on 'All clients' to show it to every client.">
          <select className={INPUT} value={form.clientId} onChange={set('clientId')}>
            <option value="">All clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.organizationName} ({c.organizationCode})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Total hectares (credits)">
          <input className={INPUT} type="number" min="1" step="0.01" value={form.totalHectares} onChange={set('totalHectares')} required placeholder="1000" />
        </Field>
        <Field label="Price per hectare (₹)">
          <input className={INPUT} type="number" min="0" step="0.01" value={form.pricePerHectare} onChange={set('pricePerHectare')} required placeholder="250" />
        </Field>
        <Field label="Validity (months)" hint="Credits and the farms they unlock stay active this long after payment.">
          <input className={INPUT} type="number" min="1" max="60" step="1" value={form.validityMonths} onChange={set('validityMonths')} required />
        </Field>
        <Field label="Features farms get" hint="Feature flags are taken from this subscription plan.">
          <select className={INPUT} value={form.featurePlanId} onChange={set('featurePlanId')} required>
            <option value="">Select a plan…</option>
            {featurePlans.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
                {p.active ? '' : ' (inactive)'}
              </option>
            ))}
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Description (optional)">
            <textarea
              className={clsx(INPUT, 'h-20 py-2')}
              value={form.description}
              onChange={set('description')}
              maxLength={1000}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#F5F7F6] px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Client pays</p>
          <p className="text-xl font-bold text-brand-primary">{formatInrMinor(totalMinor)}</p>
          <p className="text-xs text-gray-500">
            {formatCredits(form.totalHectares)} ha × {formatInrMinor(Math.round((Number(form.pricePerHectare) || 0) * 100))}/ha
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.active} onChange={set('active')} className="h-4 w-4 accent-brand-primary" />
          Available to buy
        </label>
      </div>

      {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950 disabled:opacity-60"
        >
          {saving ? 'Saving…' : plan ? 'Save changes' : 'Create plan'}
        </button>
      </div>
    </form>
  )
}

function PlanCard({ plan, busy, onEdit, onToggleActive, onDelete }) {
  return (
    <article
      className={clsx(
        'flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md',
        plan.active
          ? 'border-gray-100 hover:border-brand-primary/20'
          : 'border-dashed border-gray-300 opacity-75',
      )}
    >
      <div className="border-b border-gray-100 bg-[#FAFAFA] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-900">{plan.name}</h3>
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {plan.client ? `Only ${plan.client.organizationName}` : 'All clients'}
            </p>
          </div>
          <span
            className={clsx(
              'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
              plan.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500',
            )}
          >
            {plan.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Credits</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatCredits(plan.totalHectares)} ha</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Per hectare</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatInrMinor(plan.pricePerHectareMinor)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Total price</p>
            <p className="mt-1 text-sm font-semibold text-brand-primary">{formatInrMinor(plan.totalPriceMinor)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Validity</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatValidity(plan.validityMonths)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Features: <span className="font-medium text-gray-700">{plan.featurePlan?.name || '—'}</span>
        </p>
        {plan.description ? <p className="text-xs text-gray-500">{plan.description}</p> : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-4 py-3">
        <p className="text-xs text-gray-400">
          Bought {plan.purchaseCount || 0} time{plan.purchaseCount === 1 ? '' : 's'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onEdit(plan)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onToggleActive(plan)}
            className={clsx(
              'inline-flex items-center gap-1 rounded-lg border bg-white px-2.5 py-1.5 text-xs font-medium disabled:opacity-50',
              plan.active
                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
            )}
          >
            <Power className="h-3.5 w-3.5" />
            {plan.active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(plan)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

function PlansTab() {
  const [plans, setPlans] = useState([])
  const [featurePlans, setFeaturePlans] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | plan
  const [busyId, setBusyId] = useState(null)
  // { type: 'deactivate' | 'delete', plan } while a confirm modal is open
  const [pendingAction, setPendingAction] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [planRes, featureRes, clientRes] = await Promise.all([
        fetchClientCreditPlans(),
        fetchSubscriptionPlans(),
        fetchClients(),
      ])
      setPlans(planRes?.plans || [])
      setFeaturePlans(featureRes?.data || [])
      setClients((clientRes?.clients || []).filter((c) => c.status === 'active'))
    } catch (err) {
      setError(err.message || 'Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleSaved = (plan, wasEdit) => {
    setEditing(null)
    setNotice(wasEdit ? `${plan.name} updated.` : `${plan.name} created. Clients can now buy it from their CRM.`)
    load()
  }

  const setPlanActive = async (plan, active) => {
    try {
      setBusyId(plan.id)
      setError('')
      const res = await updateClientCreditPlan(plan.id, { active })
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, ...res.plan } : p)))
      setNotice(
        active
          ? `${plan.name} is active again. Clients can buy it.`
          : `${plan.name} deactivated. Clients can no longer buy it; existing credits are not affected.`,
      )
    } catch (err) {
      setError(err.message || 'Failed to update plan')
    } finally {
      setBusyId(null)
      setPendingAction(null)
    }
  }

  const deletePlan = async (plan) => {
    try {
      setBusyId(plan.id)
      setError('')
      await deleteClientCreditPlan(plan.id)
      setPlans((prev) => prev.filter((p) => p.id !== plan.id))
      if (editing !== 'new' && editing?.id === plan.id) setEditing(null)
      setNotice(`${plan.name} deleted.`)
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setBusyId(null)
      setPendingAction(null)
    }
  }

  // Activating is harmless, so it needs no confirmation.
  const handleToggleActive = (plan) => {
    setNotice('')
    if (plan.active) setPendingAction({ type: 'deactivate', plan })
    else setPlanActive(plan, true)
  }

  const confirmPendingAction = () => {
    const { type, plan } = pendingAction
    if (type === 'deactivate') setPlanActive(plan, false)
    else deletePlan(plan)
  }

  const pendingPlan = pendingAction?.plan
  const isDeleting = pendingAction?.type === 'delete'
  const deleteMessage = pendingPlan?.purchaseCount
    ? `"${pendingPlan.name}" will be removed permanently. Clients who already bought it keep their credits and purchase history.`
    : `"${pendingPlan?.name}" will be removed permanently.`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Hectare-credit packages clients buy for all of their farmers.
        </p>
        {!editing ? (
          <button
            type="button"
            onClick={() => {
              setNotice('')
              setEditing('new')
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
          >
            <Plus className="h-4 w-4" />
            Create plan
          </button>
        ) : null}
      </div>

      {notice ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {editing ? (
        <PlanForm
          key={editing === 'new' ? 'new' : editing.id}
          plan={editing === 'new' ? null : editing}
          featurePlans={featurePlans}
          clients={clients}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : plans.length === 0 && !editing ? (
        <EmptyState
          icon={Layers}
          title="No client plans yet"
          description="Create a plan, e.g. 1000 hectares at ₹250 per hectare. Clients can then buy it from their CRM."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              busy={busyId === plan.id}
              onEdit={(p) => {
                setNotice('')
                setEditing(p)
              }}
              onToggleActive={handleToggleActive}
              onDelete={(p) => {
                setNotice('')
                setPendingAction({ type: 'delete', plan: p })
              }}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingAction)}
        title={isDeleting ? 'Delete plan?' : 'Deactivate plan?'}
        message={
          isDeleting
            ? deleteMessage
            : `Clients will no longer be able to buy "${pendingPlan?.name}". Credits already bought are not affected, and you can activate it again any time.`
        }
        confirmLabel={isDeleting ? 'Delete plan' : 'Deactivate'}
        danger={isDeleting}
        busy={Boolean(pendingPlan) && busyId === pendingPlan.id}
        onConfirm={confirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  )
}

function ClientCreditsDetail({ clientId, onBack }) {
  const [page, setPage] = useState(1)
  const [farmerId, setFarmerId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchClientCreditsDetail(clientId, { page, limit: 20, farmerId })
      .then((res) => {
        if (!cancelled) {
          setData(res)
          setError('')
        }
      })
      .catch((err) => !cancelled && setError(err.message || 'Failed to load client credits'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [clientId, page, farmerId])

  const farmerName = useMemo(
    () => data?.byFarmer?.find((f) => f.farmerId === farmerId)?.name,
    [data, farmerId],
  )

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        All clients
      </button>
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {!data && loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : data ? (
        <>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{data.client.organizationName}</h2>
            <p className="text-sm text-gray-500">{data.client.organizationCode}</p>
          </div>
          <CreditSummary summary={data.summary} />
          <UsageByFarmerPanel
            rows={data.byFarmer}
            selectedFarmerId={farmerId}
            onSelectFarmer={(id) => {
              setPage(1)
              setFarmerId((prev) => (prev === id ? '' : id))
            }}
          />
          <UsageLedgerPanel
            transactions={data.transactions}
            pagination={data.pagination}
            loading={loading}
            onPageChange={setPage}
            farmerFilterName={farmerName}
            onClearFilter={() => {
              setPage(1)
              setFarmerId('')
            }}
          />
          <PurchasesPanel purchases={data.purchases} />
        </>
      ) : null}
    </div>
  )
}

function ClientCreditsTab() {
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchClientCreditsOverview()
      .then(setOverview)
      .catch((err) => setError(err.message || 'Failed to load client credits'))
  }, [])

  if (selected) return <ClientCreditsDetail clientId={selected} onBack={() => setSelected(null)} />

  const clients = overview?.clients || []

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {overview && clients.length === 0 ? (
        <EmptyState icon={Building2} title="No clients yet" description="Add clients from the Clients page first." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {['Client', 'Credits left', 'Usage', 'Plans bought', 'Total paid', ''].map((col) => (
                    <th key={col || 'actions'} className="px-5 py-3.5">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!overview ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-500">
                      Loading…
                    </td>
                  </tr>
                ) : (
                  clients.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">{c.organizationName}</p>
                        <p className="text-xs text-gray-400">{c.organizationCode}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {c.credits.totalCredits > 0 ? `${formatCredits(c.credits.remainingCredits)} ha` : (
                          <span className="font-normal text-gray-400">No active plan</span>
                        )}
                      </td>
                      <td className="min-w-[160px] px-5 py-4">
                        {c.credits.totalCredits > 0 ? (
                          <>
                            <p className="mb-1 text-xs text-gray-500">
                              {formatCredits(c.credits.usedCredits)} / {formatCredits(c.credits.totalCredits)} ha
                            </p>
                            <CreditMeter used={c.credits.usedCredits} total={c.credits.totalCredits} />
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{c.credits.purchases}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{formatInrMinor(c.credits.spentMinor)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(c.id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-primary hover:bg-[#E7EFEC]"
                        >
                          View usage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {overview?.recentPurchases?.length ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent purchases</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {overview.recentPurchases.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <span className="font-medium text-gray-900">
                  {p.client?.organizationName || '—'}
                  <span className="ml-2 font-normal text-gray-500">
                    {p.planName} · {formatCredits(p.totalCredits)} ha
                  </span>
                </span>
                <span className="text-gray-600">
                  {formatInrMinor(p.amountMinor)} · {formatDate(p.paidAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

const TABS = [
  { id: 'plans', label: 'Plans' },
  { id: 'clients', label: 'Client credits' },
]

export default function ClientCustomSubscriptionPage() {
  const { canManageClients } = useAuth()
  const [tab, setTab] = useState('plans')
  if (!canManageClients) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <Link to="/subscriptions" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" />
          Back to subscriptions
        </Link>
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[26px]">
            Clients custom subscription
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-gray-500">
            Sell hectare credits to client organizations. Clients activate their farmers' farms from their
            CRM, and each farm's hectares are deducted from the client's credits.
          </p>
        </header>

        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={clsx(
                'rounded-lg px-4 py-2 text-sm font-medium transition',
                tab === t.id ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'plans' ? <PlansTab /> : <ClientCreditsTab />}
      </div>
    </div>
  )
}
