import { apiRequest, buildQueryString } from '@/lib/api'

export function fetchUserManagementStats() {
  return apiRequest('/crm/user-management/stats')
}

export function fetchUserManagementList(params = {}) {
  return apiRequest(`/crm/user-management${buildQueryString(params)}`)
}

export function fetchUserById(id) {
  return apiRequest(`/crm/user-management/${id}`)
}

export function updateCrmUser(id, payload) {
  return apiRequest(`/crm/user-management/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteCrmUser(id) {
  return apiRequest(`/crm/user-management/${id}`, {
    method: 'DELETE',
  })
}

export function fetchHierarchyCapabilities() {
  return apiRequest('/crm/user-management/hierarchy')
}

export function fetchCrmAdmins(params = {}) {
  return apiRequest(`/crm/user-management/admins${buildQueryString(params)}`)
}

export function fetchPendingInvitations() {
  return apiRequest('/crm/user-management/pending')
}

export function createInvitation(payload) {
  return apiRequest('/crm/invitations', {
    method: 'POST',
    body: payload,
  })
}

export function checkAssignmentAvailability(params = {}) {
  return apiRequest(`/crm/invitations/check-availability${buildQueryString(params)}`)
}

export function suspendUserAssignment(assignmentId) {
  return apiRequest(`/crm/user-management/assignments/${assignmentId}/suspend`, {
    method: 'PATCH',
  })
}

export function resendInvitationEmail(userId) {
  return apiRequest(`/crm/invitations/resend/${userId}`, {
    method: 'POST',
  })
}

export function normalizeStatusFilter(value) {
  const v = String(value || 'all').toLowerCase()
  if (v === 'active') return 'ACTIVE'
  if (v === 'pending') return 'PENDING'
  if (v === 'verified' || v === 'awaiting') return 'VERIFIED'
  if (v === 'disabled') return 'DISABLED'
  return 'all'
}
