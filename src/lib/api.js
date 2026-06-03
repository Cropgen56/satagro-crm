import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/auth'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/v1/api/auth'

const PUBLIC_PATHS = [
  '/biodrops/whatsapp/otp',
  '/biodrops/whatsapp/verify',
  '/biodrops/whatsapp/resend',
]

let refreshPromise = null

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

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('Session expired')
  }

  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: 'POST',
    headers: buildHeaders({}, null),
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  })

  const data = await parseJson(response)
  if (!response.ok) {
    throw new Error(data?.message || 'Session expired')
  }

  const accessToken =
    data?.accessToken || data?.token || data?.data?.accessToken
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: buildHeaders(options.headers),
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  let data = await parseJson(response)

  if (
    response.status === 401 &&
    retry &&
    !isPublic &&
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
    const message =
      data?.message || data?.error || `Request failed with status ${response.status}`
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
      credentials: 'include',
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
