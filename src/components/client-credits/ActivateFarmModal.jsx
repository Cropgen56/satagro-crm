import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'
import { formatCredits, formatDate } from '@/lib/clientCredits'

function Row({ label, value, strong, tone }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={
          strong
            ? 'text-base font-bold text-brand-primary'
            : tone === 'bad'
              ? 'font-semibold text-red-600'
              : 'font-medium text-gray-900'
        }
      >
        {value}
      </span>
    </div>
  )
}

/**
 * Confirm → processing → success | error for activating one farmer's farm
 * from the client's credits. `stage` is driven by the page.
 */
export default function ActivateFarmModal({
  farm,
  remainingCredits,
  stage,
  errorMessage,
  result,
  onConfirm,
  onClose,
}) {
  const processing = stage === 'processing'

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !processing) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [processing, onClose])

  if (!farm) return null

  const enough = remainingCredits + 1e-6 >= farm.creditsNeeded
  const after = Math.max(0, remainingCredits - farm.creditsNeeded)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
        onClick={processing ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="activate-farm-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
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
            <h2 id="activate-farm-title" className="mt-4 text-lg font-semibold text-gray-900">
              Subscription activated
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {farm.fieldName} of {farm.farmer.name} is now unlocked
              {result?.endDate ? ` until ${formatDate(result.endDate)}` : ''}.{' '}
              {formatCredits(result?.creditsUsed ?? farm.creditsNeeded)} credits were deducted.
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
              <h2 id="activate-farm-title" className="text-lg font-semibold text-gray-900">
                Activate subscription
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                The farm's area is deducted from your credits (1 credit = 1 hectare) and all plan
                features unlock for the farmer.
              </p>
            </div>

            <div className="divide-y divide-gray-100 px-6 py-2">
              <Row label="Farmer" value={farm.farmer.name} />
              <Row label="Farm" value={farm.fieldName} />
              <Row
                label="Farm size"
                value={`${formatCredits(farm.hectares)} ha (${formatCredits(farm.acres)} acres)`}
              />
              <Row label="Credits to deduct" value={formatCredits(farm.creditsNeeded)} strong />
              <Row
                label="Credits available"
                value={formatCredits(remainingCredits)}
                tone={enough ? undefined : 'bad'}
              />
              {enough ? <Row label="Credits left after" value={formatCredits(after)} /> : null}
            </div>

            {!enough ? (
              <div className="mx-6 mb-2 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Not enough credits for this farm. Buy a plan below to activate it.
              </div>
            ) : null}
            {stage === 'error' ? (
              <div className="mx-6 mb-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {errorMessage || 'Something went wrong. Please try again.'}
              </div>
            ) : null}

            <div className="flex gap-2 bg-gray-50/60 px-6 py-4">
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
                disabled={processing || !enough}
                onClick={onConfirm}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Activating…
                  </>
                ) : stage === 'error' ? (
                  'Try again'
                ) : (
                  'Activate'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
