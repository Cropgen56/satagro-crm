import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Layers } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import PurchasePlanModal from '@/components/client-credits/PurchasePlanModal'
import {
  CreditSummary,
  PurchasesPanel,
  UsageByFarmerPanel,
  UsageLedgerPanel,
} from '@/components/client-credits/ClientCreditPanels'
import { useAuth } from '@/hooks/useAuth'
import {
  cancelClientCreditPurchase,
  fetchMyClientCreditPlans,
  fetchMyClientCreditUsage,
  fetchMyClientCredits,
  formatCredits,
  formatInrMinor,
  formatValidity,
  openRazorpayCheckout,
  startClientCreditPurchase,
  verifyClientCreditPurchase,
} from '@/lib/clientCredits'

function PlanOffer({ plan, onBuy }) {
  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-brand-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
        <span className="shrink-0 rounded-full bg-[#E7EFEC] px-2.5 py-1 text-xs font-semibold text-brand-primary">
          {formatCredits(plan.totalHectares)} ha
        </span>
      </div>
      {plan.description ? <p className="mt-1 text-sm text-gray-500">{plan.description}</p> : null}
      <p className="mt-4 text-2xl font-bold text-brand-primary">{formatInrMinor(plan.totalPriceMinor)}</p>
      <p className="text-xs text-gray-500">
        {formatInrMinor(plan.pricePerHectareMinor)} per hectare · valid {formatValidity(plan.validityMonths)}
      </p>
      <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-brand-primary" />
          Covers {formatCredits(plan.totalHectares)} hectares of farms
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-brand-primary" />
          Your farmers never see a payment screen
        </li>
        {plan.featurePlan?.name ? (
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-primary" />
            {plan.featurePlan.name} features
          </li>
        ) : null}
      </ul>
      <button
        type="button"
        onClick={() => onBuy(plan)}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Buy plan
      </button>
    </article>
  )
}

export default function ClientSubscriptionPage() {
  const { isClientViewer } = useAuth()
  if (!isClientViewer) return <Navigate to="/subscriptions" replace />
  return <ClientSubscription />
}

function ClientSubscription() {
  const { user, clientOrganization } = useAuth()
  const [credits, setCredits] = useState(null)
  const [plans, setPlans] = useState([])
  const [usage, setUsage] = useState(null)
  const [usageLoading, setUsageLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [farmerId, setFarmerId] = useState('')
  const [error, setError] = useState('')
  // { plan, stage: 'confirm' | 'processing' | 'success' | 'error', errorMessage }
  const [purchase, setPurchase] = useState(null)

  const loadCredits = useCallback(async () => {
    try {
      const [creditRes, planRes] = await Promise.all([fetchMyClientCredits(), fetchMyClientCreditPlans()])
      setCredits(creditRes)
      setPlans(planRes?.plans || [])
    } catch (err) {
      setError(err.message || 'Failed to load your subscription')
    }
  }, [])

  useEffect(() => {
    loadCredits()
  }, [loadCredits])

  useEffect(() => {
    let cancelled = false
    setUsageLoading(true)
    fetchMyClientCreditUsage({ page, limit: 20, farmerId })
      .then((res) => !cancelled && setUsage(res))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load usage'))
      .finally(() => !cancelled && setUsageLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, farmerId])

  const closePurchase = useCallback(() => setPurchase(null), [])

  const confirmPurchase = async () => {
    const { plan } = purchase
    const succeed = async () => {
      setPurchase({ plan, stage: 'success' })
      setPage(1)
      await loadCredits()
    }
    setPurchase({ plan, stage: 'processing' })
    let start = null
    try {
      start = await startClientCreditPurchase(plan.id)
      // No Razorpay order = the server activated the plan directly.
      if (!start.razorpayOrder) {
        await succeed()
        return
      }
      const payment = await openRazorpayCheckout({
        start,
        plan,
        organizationName: clientOrganization?.organizationName,
        email: user?.email,
      })
      if (!payment) {
        await cancelClientCreditPurchase(start.purchase.id).catch(() => {})
        setPurchase({ plan, stage: 'confirm' })
        return
      }
      await verifyClientCreditPurchase(start.purchase.id, payment)
      await succeed()
    } catch (err) {
      setPurchase({
        plan,
        stage: 'error',
        errorMessage:
          start && start.razorpayOrder
            ? `${err.message || 'Payment could not be confirmed.'} If money was deducted, the credits will appear here within a few minutes.`
            : err.message || 'Could not complete the purchase.',
      })
      if (start) loadCredits()
    }
  }

  const summary = credits?.summary
  const farmerName = useMemo(
    () => credits?.byFarmer?.find((f) => f.farmerId === farmerId)?.name,
    [credits, farmerId],
  )

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[26px]">Subscription</h1>
          <p className="mt-1 max-w-3xl text-sm text-gray-500">
            Buy hectare credits for {clientOrganization?.organizationName || 'your organization'}. While you
            have credits, every farm your farmers add is unlocked automatically and its area is deducted
            here (1 credit = 1 hectare).
          </p>
        </header>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {summary && !summary.hasActivePlan ? (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              You have no credits left. Your farmers will be asked to pay when they add a farm until you
              buy a plan.
            </span>
          </div>
        ) : null}

        {summary ? <CreditSummary summary={summary} /> : (
          <div className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white" />
        )}

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Available plans</h2>
          {credits && plans.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No plans available yet"
              description="Contact SatAgro to set up a hectare plan for your organization."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => (
                <PlanOffer
                  key={plan.id}
                  plan={plan}
                  onBuy={(p) => setPurchase({ plan: p, stage: 'confirm' })}
                />
              ))}
            </div>
          )}
        </section>

        <UsageByFarmerPanel
          rows={credits?.byFarmer || []}
          selectedFarmerId={farmerId}
          onSelectFarmer={(id) => {
            setPage(1)
            setFarmerId((prev) => (prev === id ? '' : id))
          }}
        />
        <UsageLedgerPanel
          transactions={usage?.transactions || []}
          pagination={usage?.pagination}
          loading={usageLoading}
          onPageChange={setPage}
          farmerFilterName={farmerName}
          onClearFilter={() => {
            setPage(1)
            setFarmerId('')
          }}
        />
        <PurchasesPanel purchases={credits?.purchases || []} />
      </div>

      <PurchasePlanModal
        plan={purchase?.plan}
        stage={purchase?.stage}
        errorMessage={purchase?.errorMessage}
        onConfirm={confirmPurchase}
        onClose={closePurchase}
      />
    </div>
  )
}
