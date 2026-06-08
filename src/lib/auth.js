const ACCESS_TOKEN_KEY = 'satagro_access_token'
const REFRESH_TOKEN_KEY = 'satagro_refresh_token'
const LOGIN_PHONE_KEY = 'satagro_login_phone'
const LOGIN_EMAIL_KEY = 'satagro_login_email'
const LOGIN_METHOD_KEY = 'satagro_login_method'

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
  sessionStorage.setItem(LOGIN_METHOD_KEY, 'phone')
  sessionStorage.removeItem(LOGIN_EMAIL_KEY)
}

export function getLoginPhone() {
  return sessionStorage.getItem(LOGIN_PHONE_KEY) || ''
}

export function setLoginEmail(email) {
  if (!email) return
  sessionStorage.setItem(LOGIN_EMAIL_KEY, email.trim().toLowerCase())
  sessionStorage.setItem(LOGIN_METHOD_KEY, 'email')
  sessionStorage.removeItem(LOGIN_PHONE_KEY)
}

export function getLoginEmail() {
  return sessionStorage.getItem(LOGIN_EMAIL_KEY) || ''
}

export function getLoginMethod() {
  const method = sessionStorage.getItem(LOGIN_METHOD_KEY)
  if (method === 'email' || method === 'phone') return method
  if (getLoginEmail()) return 'email'
  if (getLoginPhone()) return 'phone'
  return null
}

export function clearLoginPhone() {
  sessionStorage.removeItem(LOGIN_PHONE_KEY)
}

export function clearLoginEmail() {
  sessionStorage.removeItem(LOGIN_EMAIL_KEY)
}

export function clearLoginSession() {
  sessionStorage.removeItem(LOGIN_PHONE_KEY)
  sessionStorage.removeItem(LOGIN_EMAIL_KEY)
  sessionStorage.removeItem(LOGIN_METHOD_KEY)
}

export function clearAuthStorage() {
  clearAccessToken()
  clearRefreshToken()
  clearLoginSession()
}

export function hasPendingOtpSession() {
  return Boolean(getLoginPhone() || getLoginEmail())
}

export function hasStoredSession() {
  return Boolean(getAccessToken() || getRefreshToken())
}

/** Normalize Mongo/API user id for reliable comparisons. */
export function getUserId(user) {
  if (!user) return null
  const raw = user.id ?? user._id
  if (raw == null || raw === '') return null
  return String(raw)
}

export function isSameUser(user, otherUserOrId) {
  const left = getUserId(user)
  const right =
    typeof otherUserOrId === 'string' ? otherUserOrId : getUserId(otherUserOrId)
  if (!left || !right) return false
  return left === right
}

export function normalizeProfileUser(user) {
  if (!user) return null
  const id = getUserId(user)
  if (!id) return user
  return { ...user, id, _id: id }
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
