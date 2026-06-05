import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchFarmers(params = {}) {
  return apiRequest(`/crm/farmers${buildQueryString(params)}`)
}

export function fetchFarmerStats() {
  return apiRequest('/crm/farmers/stats')
}
