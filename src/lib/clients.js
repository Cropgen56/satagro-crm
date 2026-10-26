import { apiRequest } from '@/lib/api'

export function fetchClients() {
  return apiRequest('/crm/clients')
}

export function fetchClientById(id) {
  return apiRequest(`/crm/clients/${id}`)
}

export function createClient(payload) {
  return apiRequest('/crm/clients', {
    method: 'POST',
    body: payload,
  })
}

export function updateClient(id, payload) {
  return apiRequest(`/crm/clients/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

/** clientId null detaches the farmer from any client. */
export function assignFarmerClient(farmerId, clientId) {
  return apiRequest(`/crm/farmers/${farmerId}/client`, {
    method: 'PATCH',
    body: { clientId },
  })
}
