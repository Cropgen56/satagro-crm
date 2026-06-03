const ACCESS_TOKEN_KEY = 'satagro_access_token'
const REFRESH_TOKEN_KEY = 'satagro_refresh_token'
const LOGIN_PHONE_KEY = 'satagro_login_phone'

const PLATFORM_CRM_ROLES = new Set(['admin', 'developer'])

export function setAccessToken(token) {
  if (!token) return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setRefreshToken(token) {
  if (!token) return
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function setLoginPhone(phone) {
  if (!phone) return
  sessionStorage.setItem(LOGIN_PHONE_KEY, phone)
}

export function getLoginPhone() {
  return sessionStorage.getItem(LOGIN_PHONE_KEY) || ''
}

export function clearLoginPhone() {
  sessionStorage.removeItem(LOGIN_PHONE_KEY)
}

export function clearAuthStorage() {
  clearAccessToken()
  clearRefreshToken()
  clearLoginPhone()
}

export function hasStoredSession() {
  return Boolean(getAccessToken() || getRefreshToken())
}

export function canAccessCrm(user, assignments = []) {
  if (!user) return false
  if (PLATFORM_CRM_ROLES.has(user.role)) return true
  if (user.role === 'staff' && Array.isArray(assignments) && assignments.length > 0) {
    return true
  }
  return false
}

export function formatUserDisplayName(user) {
  if (!user) return 'User'
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return name || user.email || user.phone || 'User'
}

export function formatUserRoleLabel(user, assignments = []) {
  if (!user) return ''
  if (PLATFORM_CRM_ROLES.has(user.role)) {
    return user.role === 'developer' ? 'Platform Developer' : 'Platform Admin'
  }
  const level = assignments?.[0]?.level
  const labels = {
    super: 'Super Admin',
    country: 'Country Admin',
    state: 'State Admin',
    district: 'District Operator',
    ground: 'Field Agent',
  }
  if (level && labels[level]) return labels[level]
  if (user.role === 'staff') return 'Staff'
  return String(user.role || '').replace(/^\w/, (c) => c.toUpperCase())
}
