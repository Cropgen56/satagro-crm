import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchProducts(params = {}) {
  return apiRequest(`/crm/products${buildQueryString(params)}`)
}

export function fetchProductById(id) {
  return apiRequest(`/crm/products/${id}`)
}

export function createProduct(body) {
  return apiRequest('/crm/products', { method: 'POST', body })
}

export function updateProduct(id, body) {
  return apiRequest(`/crm/products/${id}`, { method: 'PATCH', body })
}

export function archiveProduct(id) {
  return apiRequest(`/crm/products/${id}`, { method: 'DELETE' })
}

export function deleteProduct(id) {
  return apiRequest(`/crm/products/${id}`, { method: 'DELETE' })
}
