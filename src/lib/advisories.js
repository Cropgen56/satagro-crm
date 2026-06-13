import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchFarmerAdvisories(farmerId, params = {}) {
  return apiRequest(
    `/crm/farmers/${farmerId}/advisories${buildQueryString(params)}`,
  )
}
