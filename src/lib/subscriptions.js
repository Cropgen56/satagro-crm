import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchSubscribers(params = {}) {
  return apiRequest(`/crm/subscriptions${buildQueryString(params)}`)
}

export function fetchFarmerSubscriptions(farmerId) {
  return apiRequest(`/crm/farmers/${farmerId}/subscriptions`)
}

export function activateFarmerSubscription(farmerId, payload) {
  return apiRequest(`/crm/farmers/${farmerId}/subscriptions/activate`, {
    method: 'POST',
    body: payload,
  })
}

export function cancelFarmerSubscription(subscriptionId) {
  return apiRequest(`/crm/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
  })
}

export function approveCardRemainder(subscriptionId) {
  return apiRequest(`/crm/subscriptions/${subscriptionId}/approve-card-remainder`, {
    method: 'POST',
  })
}
