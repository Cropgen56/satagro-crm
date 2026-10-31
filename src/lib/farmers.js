import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchFarmers(params = {}) {
  return apiRequest(`/crm/farmers${buildQueryString(params)}`)
}

export function fetchFarmerStats() {
  return apiRequest('/crm/farmers/stats')
}

/** CRM admin registers a new BIODROPS farmer; returns the farmer detail. */
export function createFarmer(payload) {
  return apiRequest('/crm/farmers', { method: 'POST', body: payload })
}

/** CRM admin edits a farmer's profile; returns the updated farmer detail. */
export function updateFarmer(id, payload) {
  return apiRequest(`/crm/farmers/${id}`, { method: 'PATCH', body: payload })
}

/** CRM admin soft-deletes a farmer (they can no longer log in). */
export function deleteFarmer(id) {
  return apiRequest(`/crm/farmers/${id}`, { method: 'DELETE' })
}

export function fetchFarmerById(id) {
  return apiRequest(`/crm/farmers/${id}`)
}
