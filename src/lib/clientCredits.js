import { apiRequest, buildQueryString } from '@/lib/api'

/* ------------------------------ admin ------------------------------ */

export function fetchClientCreditPlans() {
  return apiRequest('/crm/client-credit-plans')
}

export function createClientCreditPlan(payload) {
  return apiRequest('/crm/client-credit-plans', { method: 'POST', body: payload })
}

export function updateClientCreditPlan(id, payload) {
  return apiRequest(`/crm/client-credit-plans/${id}`, { method: 'PATCH', body: payload })
}

export function deleteClientCreditPlan(id) {
  return apiRequest(`/crm/client-credit-plans/${id}`, { method: 'DELETE' })
}

export function fetchClientCreditsOverview() {
  return apiRequest('/crm/client-credits/overview')
}

export function fetchClientCreditsDetail(clientId, params = {}) {
  return apiRequest(`/crm/client-credits/clients/${clientId}${buildQueryString(params)}`)
}

/* --------------------------- client viewer -------------------------- */

export function fetchMyClientCredits() {
  return apiRequest('/crm/client-credits/me')
}

export function fetchMyClientCreditPlans() {
  return apiRequest('/crm/client-credits/me/plans')
}

export function fetchMyClientCreditUsage(params = {}) {
  return apiRequest(`/crm/client-credits/me/usage${buildQueryString(params)}`)
}

export function startClientCreditPurchase(planId) {
  return apiRequest('/crm/client-credits/me/purchases', { method: 'POST', body: { planId } })
}

export function verifyClientCreditPurchase(purchaseId, payment) {
  return apiRequest(`/crm/client-credits/me/purchases/${purchaseId}/verify`, {
    method: 'POST',
    body: payment,
  })
}

export function cancelClientCreditPurchase(purchaseId) {
  return apiRequest(`/crm/client-credits/me/purchases/${purchaseId}/cancel`, {
    method: 'POST',
  })
}

/* ----------------------------- helpers ------------------------------ */

export function formatInrMinor(minor) {
  const rupees = (Number(minor) || 0) / 100
  return `₹${rupees.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

export function formatCredits(value) {
  return (Number(value) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatValidity(months) {
  const m = Number(months) || 0
  if (m % 12 === 0) return `${m / 12} year${m === 12 ? '' : 's'}`
  return `${m} month${m === 1 ? '' : 's'}`
}

export const PURCHASE_STATUS_STYLES = {
  active: { label: 'Active', className: 'bg-green-50 text-green-700' },
  exhausted: { label: 'Used up', className: 'bg-amber-50 text-amber-700' },
  expired: { label: 'Expired', className: 'bg-gray-100 text-gray-500' },
  pending: { label: 'Payment pending', className: 'bg-blue-50 text-blue-700' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-600' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
}

let razorpayScript = null

/** Loads Razorpay Checkout once per page. */
export function loadRazorpayCheckout() {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(window.Razorpay)
  if (!razorpayScript) {
    razorpayScript = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(window.Razorpay)
      script.onerror = () => {
        razorpayScript = null
        reject(new Error('Could not load the payment window. Check your connection.'))
      }
      document.body.appendChild(script)
    })
  }
  return razorpayScript
}

/**
 * Opens Razorpay for a started purchase. Resolves with the payment fields on
 * success, or null when the user closes the window without paying.
 */
export async function openRazorpayCheckout({ start, plan, organizationName, email }) {
  const Razorpay = await loadRazorpayCheckout()
  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: start.razorpayKeyId,
      order_id: start.razorpayOrder.id,
      amount: start.razorpayOrder.amount,
      currency: start.razorpayOrder.currency,
      name: 'SatAgro',
      description: `${plan.name} · ${formatCredits(plan.totalHectares)} ha credits`,
      prefill: { name: organizationName || '', email: email || '' },
      notes: { purchaseId: start.purchase.id },
      theme: { color: '#0d5245' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => resolve(null) },
    })
    checkout.on('payment.failed', (event) => {
      reject(new Error(event?.error?.description || 'Payment failed. Please try again.'))
    })
    checkout.open()
  })
}
