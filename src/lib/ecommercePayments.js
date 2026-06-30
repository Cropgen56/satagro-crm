import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchShopPayments(params = {}) {
  return apiRequest(`/crm/ecommerce/payments${buildQueryString(params)}`)
}
