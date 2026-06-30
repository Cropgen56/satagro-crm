import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchOrders(params = {}) {
  return apiRequest(`/crm/orders${buildQueryString(params)}`)
}

export function fetchOrderById(id) {
  return apiRequest(`/crm/orders/${id}`)
}

export function updateOrder(id, body) {
  return apiRequest(`/crm/orders/${id}`, { method: 'PATCH', body })
}

export function cancelOrder(id, body) {
  return apiRequest(`/crm/orders/${id}/cancel`, { method: 'POST', body })
}

export function fetchOrderStats() {
  return apiRequest('/crm/orders/stats')
}
