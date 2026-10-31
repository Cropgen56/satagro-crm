import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/auth'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://server.cropgenapp.com/v1/api/auth'

const PUBLIC_PATHS = [
  '/biodrops/whatsapp/otp',
  '/biodrops/whatsapp/verify',
  '/biodrops/whatsapp/resend',
  '/biodrops/login/otp',
  '/biodrops/login/verify',
]

let refreshPromise = null

// Requests never send cookies (credentials: 'omit'): auth is the Bearer
// token and the refresh token in the body, both from per-account storage in
// lib/auth. A shared cookie would let the last CRM login in this browser take
// over every tab's refresh — see lib/auth for the multi-account model.

export const TOKEN_AUTH_PATTERNS = [
  'invalid or expired token',
  'no token provided',
  'invalid token',
  'unauthorized',
  'session expired',
]

export function isAuthErrorMessage(message = '') {
  const normalized = String(message).toLowerCase()
  return TOKEN_AUTH_PATTERNS.some((pattern) => normalized.includes(pattern))
}

function isTokenAuthFailure(response, data) {
  if (response.status === 401) return true
  if (response.status !== 403) return false
  const message = String(data?.message || data?.error || '').toLowerCase()
  return TOKEN_AUTH_PATTERNS.some((pattern) => message.includes(pattern))
}

function buildHeaders(extraHeaders = {}, accessToken = getAccessToken()) {
  return {
    'Content-Type': 'application/json',
    'X-Client-Brand': 'biodrops',
    'X-Client-App': 'satagro_crm',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...extraHeaders,
  }
}

async function parseJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('Session expired')
  }

  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: 'POST',
    headers: buildHeaders({}, null),
    credentials: 'omit',
    body: JSON.stringify({ refreshToken }),
  })

  const data = await parseJson(response)
  if (!response.ok) {
    throw new Error(data?.message || 'Session expired')
  }

  const accessToken = data?.accessToken || data?.token || data?.data?.accessToken
  if (!accessToken) {
    throw new Error('Session expired')
  }

  setAccessToken(accessToken)
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken)
  }

  return accessToken
}

function getRefreshOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export async function apiRequest(path, options = {}, retry = true) {
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p))

  const url = /^https?:\/\//.test(path) ? path : `${API_BASE_URL}${path}`
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: buildHeaders(options.headers),
    credentials: 'omit',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  let data = await parseJson(response)

  if (
    isTokenAuthFailure(response, data) &&
    retry &&
    !isPublic &&
    path !== '/refresh' &&
    getRefreshToken()
  ) {
    try {
      await getRefreshOnce()
      return apiRequest(path, options, false)
    } catch {
      clearAuthStorage()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('satagro:auth-expired'))
      }
      throw new Error(data?.message || 'Session expired. Please sign in again.')
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}

export async function logoutRequest() {
  const refreshToken = getRefreshToken()
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'omit',
      body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
    })
  } catch {
    // Best-effort server logout
  } finally {
    clearAuthStorage()
  }
}

export function extractAccessToken(payload) {
  return (
    payload?.accessToken ||
    payload?.token ||
    payload?.data?.accessToken ||
    payload?.data?.token ||
    null
  )
}

export function extractRefreshToken(payload) {
  return payload?.refreshToken || payload?.data?.refreshToken || null
}

export function buildQueryString(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })
  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}
