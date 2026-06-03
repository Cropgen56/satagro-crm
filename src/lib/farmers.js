import { apiRequest } from '@/lib/api'

export function fetchFarmers(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/crm/farmers${suffix}`)
}

export function fetchFarmerStats() {
  return apiRequest('/crm/farmers/stats')
}
