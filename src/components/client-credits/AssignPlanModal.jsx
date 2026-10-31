import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'
import {
  assignClientCreditPlan,
  fetchClientCreditPlans,
  formatCredits,
  formatInrMinor,
  formatValidity,
} from '@/lib/clientCredits'

/**
 * Super admin picks one of the plans available to `client` (global plans plus
 * ones made for this client) and assigns it. Credits are active at once.
 */
export default function AssignPlanModal({ client, onAssigned, onClose }) {
  const [plans, setPlans] = useState(null)
  const [planId, setPlanId] = useState('')
  const [stage, setStage] = useState('pick') // pick | processing | success | error
  const [error, setError] = useState('')
  const processing = stage === 'processing'

  useEffect(() => {
    fetchClientCreditPlans()
      .then((res) => setPlans(res?.plans || []))
      .catch((err) => {
        setPlans([])
        setError(err.message || 'Failed to load plans')
        setStage('error')
      })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !processing) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [processing, onClose])

  const available = useMemo(
    () => (plans || []).filter((p) => p.active && (!p.client || p.client.id === client.id)),
    [plans, client.id],
  )
  const selected = available.find((p) => p.id === planId)

  const handleAssign = async () => {
    if (!selected) return
    setStage('processing')
    setError('')
    try {
      await assignClientCreditPlan(client.id, selected.id)
      setStage('success')
      onAssigned?.()
    } catch (err) {
      setError(err.message || 'Failed to assign plan')
      setStage('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
        onClick={processing ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-plan-title"
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {!processing ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        {stage === 'success' ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 id="assign-plan-title" className="mt-4 text-lg font-semibold text-gray-900">
              Plan assigned
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {formatCredits(selected?.totalHectares)} hectares of credits were added to{' '}
              {client.organizationName}. They can activate their farmers' farms right away.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-6 pb-4 pt-6">
              <h2 id="assign-plan-title" className="text-lg font-semibold text-gray-900">
                Assign plan
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Give <span className="font-medium text-gray-700">{client.organizationName}</span> a plan.
                Credits are active immediately and no payment is taken.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!plans ? (
                <p className="py-6 text-center text-sm text-gray-500">Loading plans…</p>
              ) : available.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  No active plans for this client. Create one in the Plans tab first.
                </p>
              ) : (
                <ul className="space-y-2">
                  {available.map((p) => (
                    <li key={p.id}>
                      <label
                        className={clsx(
                          'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition',
                          planId === p.id
                            ? 'border-brand-primary bg-[#E7EFEC]/60'
                            : 'border-gray-200 hover:border-gray-300',
                        )}
                      >
                        <input
                          type="radio"
                          name="assign-plan"
                          value={p.id}
                          checked={planId === p.id}
                          onChange={() => setPlanId(p.id)}
                          disabled={processing}
                          className="mt-1 accent-brand-primary"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                            {p.client ? (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                Only for this client
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-xs text-gray-500">
                            {formatCredits(p.totalHectares)} ha · {formatValidity(p.validityMonths)} · list price{' '}
                            {formatInrMinor(p.totalPriceMinor)}
                            {p.featurePlan ? ` · ${p.featurePlan.name}` : ''}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {stage === 'error' ? (
              <div className="mx-6 mb-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error || 'Something went wrong. Please try again.'}
              </div>
            ) : null}

            <div className="flex gap-2 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
              <button
                type="button"
                disabled={processing}
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing || !selected}
                onClick={handleAssign}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Assigning…
                  </>
                ) : (
                  'Assign plan'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
