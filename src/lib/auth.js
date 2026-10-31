const ACCESS_TOKEN_KEY = 'satagro_access_token'
const REFRESH_TOKEN_KEY = 'satagro_refresh_token'
const LOGIN_PHONE_KEY = 'satagro_login_phone'
const LOGIN_EMAIL_KEY = 'satagro_login_email'
const LOGIN_METHOD_KEY = 'satagro_login_method'
/** sessionStorage: the account this tab is signed in as. */
const TAB_USER_KEY = 'satagro_tab_user'
/** localStorage: the most recent login — what a brand-new tab opens as. */
const LAST_USER_KEY = 'satagro_last_user'
/** TAB_USER_KEY value for a tab that is signing in to a different account. */
const NEW_ACCOUNT_TAB = '__new__'

const PLATFORM_CRM_ROLES = new Set(['admin', 'developer'])

/*
 * Tokens are stored per account (`satagro_access_token:<userId>`), and each
 * tab remembers which account it is signed in as. So a super admin and a
 * client can be signed in to the CRM in different tabs of one browser without
 * replacing each other, while every tab of the same account shares one token
 * pair (the server rotates refresh tokens, so tabs of one account must share).
 */

const keyFor = (base, userId) => `${base}:${userId}`

function storageGet(storage, key) {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(storage, key, value) {
  try {
    storage.setItem(key, value)
  } catch {
    // Storage blocked (private mode): the session lasts for this page only.
  }
}

function storageRemove(storage, key) {
  try {
    storage.removeItem(key)
  } catch {
    // ignore
  }
}

/** The user id inside a JWT (access and refresh tokens both carry `id`). */
function userIdFromToken(token) {
  try {
    const part = String(token).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const id = JSON.parse(atob(part))?.id
    return id ? String(id) : null
  } catch {
    return null
  }
}

/** Account ids with stored tokens in this browser. */
function storedUserIds() {
  const ids = new Set()
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i) || ''
      const match = key.match(/^satagro_(?:access|refresh)_token:(.+)$/)
      if (match) ids.add(match[1])
    }
  } catch {
    // ignore
  }
  return [...ids]
}

/** Move tokens saved before per-account storage into the new layout. */
function migrateLegacyTokens() {
  const access = storageGet(localStorage, ACCESS_TOKEN_KEY)
  const refresh = storageGet(localStorage, REFRESH_TOKEN_KEY)
  if (!access && !refresh) return
  const userId = userIdFromToken(access) || userIdFromToken(refresh)
  if (userId) {
    if (access) storageSet(localStorage, keyFor(ACCESS_TOKEN_KEY, userId), access)
    if (refresh) storageSet(localStorage, keyFor(REFRESH_TOKEN_KEY, userId), refresh)
    if (!storageGet(localStorage, LAST_USER_KEY)) storageSet(localStorage, LAST_USER_KEY, userId)
  }
  storageRemove(localStorage, ACCESS_TOKEN_KEY)
  storageRemove(localStorage, REFRESH_TOKEN_KEY)
}

if (typeof window !== 'undefined') migrateLegacyTokens()

/**
 * The account this tab uses. A new tab adopts the most recent login once and
 * then keeps it, so later logins in other tabs don't switch this one.
 */
function currentUserId() {
  const tabUser = storageGet(sessionStorage, TAB_USER_KEY)
  if (tabUser === NEW_ACCOUNT_TAB) return null
  if (tabUser) return tabUser
  const last = storageGet(localStorage, LAST_USER_KEY)
  if (last) storageSet(sessionStorage, TAB_USER_KEY, last)
  return last
}

function bindTabTo(userId) {
  storageSet(sessionStorage, TAB_USER_KEY, userId)
  storageSet(localStorage, LAST_USER_KEY, userId)
}

function storeToken(base, token) {
  if (!token) return
  const userId = userIdFromToken(token) || currentUserId()
  if (!userId) return
  bindTabTo(userId)
  storageSet(localStorage, keyFor(base, userId), token)
}

function readToken(base) {
  const userId = currentUserId()
  return userId ? storageGet(localStorage, keyFor(base, userId)) : null
}

export function setAccessToken(token) {
  storeToken(ACCESS_TOKEN_KEY, token)
}

export function getAccessToken() {
  return readToken(ACCESS_TOKEN_KEY)
}

export function setRefreshToken(token) {
  storeToken(REFRESH_TOKEN_KEY, token)
}

export function getRefreshToken() {
  return readToken(REFRESH_TOKEN_KEY)
}

export function clearAccessToken() {
  const userId = currentUserId()
  if (userId) storageRemove(localStorage, keyFor(ACCESS_TOKEN_KEY, userId))
}

export function clearRefreshToken() {
  const userId = currentUserId()
  if (userId) storageRemove(localStorage, keyFor(REFRESH_TOKEN_KEY, userId))
}

/**
 * Sign this tab's account out of this browser; other accounts stay signed
 * in. A new tab then opens as one of the remaining accounts, if any.
 */
function unbindTab() {
  const userId = storageGet(sessionStorage, TAB_USER_KEY)
  // Stay signed out in this tab — don't fall back to another stored account.
  storageSet(sessionStorage, TAB_USER_KEY, NEW_ACCOUNT_TAB)
  if (userId === NEW_ACCOUNT_TAB) return
  if (userId && storageGet(localStorage, LAST_USER_KEY) === userId) {
    const remaining = storedUserIds().filter((id) => id !== userId)
    if (remaining.length) storageSet(localStorage, LAST_USER_KEY, remaining[0])
    else storageRemove(localStorage, LAST_USER_KEY)
  }
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

/**
 * "Use another account": detach this tab from its account without signing
 * it out (its other tabs keep working), so this tab can log in as someone
 * else — e.g. a client next to a super admin.
 */
export function startAnotherAccountInTab() {
  storageSet(sessionStorage, TAB_USER_KEY, NEW_ACCOUNT_TAB)
  clearLoginSession()
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
  unbindTab()
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
  const right = typeof otherUserOrId === 'string' ? otherUserOrId : getUserId(otherUserOrId)
  if (!left || !right) return false
  return left === right
}

export function normalizeProfileUser(user) {
  if (!user) return null
  const id = getUserId(user)
  if (!id) return user
  return { ...user, id, _id: id }
}

/**
 * Read-only client login: staff with a BioDrops client org and no admin
 * assignment. Mirrors isClientViewer on the server.
 */
export function isClientViewer(user, assignments = []) {
  return (
    user?.role === 'staff' &&
    Boolean(user.clientOrganization) &&
    !(Array.isArray(assignments) && assignments.length > 0)
  )
}

/** Platform admins and super admins manage BioDrops clients. */
export function canManageClients(user, assignments = []) {
  if (!user) return false
  if (PLATFORM_CRM_ROLES.has(user.role)) return true
  return (assignments || []).some((a) => a.level === 'super')
}

export function canAccessCrm(user, assignments = []) {
  if (!user) return false
  if (PLATFORM_CRM_ROLES.has(user.role)) return true
  if (isClientViewer(user, assignments)) {
    return user.clientOrganization?.status !== 'inactive'
  }
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
  if (isClientViewer(user, assignments)) return 'Client'
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
