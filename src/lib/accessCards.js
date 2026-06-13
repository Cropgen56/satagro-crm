import { apiRequest, buildQueryString } from '@/lib/api'

/** Deep link encoded in each printed QR — must match biodrops-app linking config. */
export function buildCardQrUrl(code) {
  return `satagro://unlock?code=${encodeURIComponent(code)}`
}

export function generateAccessCards(payload) {
  return apiRequest('/crm/access-cards/generate', {
    method: 'POST',
    body: payload,
  })
}

export function fetchAccessCards(params = {}) {
  return apiRequest(`/crm/access-cards${buildQueryString(params)}`)
}

export function fetchAccessCardById(cardId) {
  return apiRequest(`/crm/access-cards/${cardId}`)
}

export function fetchAccessCardEvents(cardId) {
  return apiRequest(`/crm/access-cards/${cardId}/events`)
}

export function fetchFarmerAccessCards(farmerId) {
  return apiRequest(`/crm/farmers/${farmerId}/access-cards`)
}

const CARD_CODE_CACHE_KEY = 'biodrops_generated_card_codes'

export function cacheGeneratedCardCodes(codes, batchId) {
  if (typeof sessionStorage === 'undefined' || !Array.isArray(codes)) return
  try {
    const stored = JSON.parse(sessionStorage.getItem(CARD_CODE_CACHE_KEY) || '{}')
    for (const row of codes) {
      if (!row?.cardId || !row?.code) continue
      stored[row.cardId] = {
        code: row.code,
        qrUrl: row.qrUrl || buildCardQrUrl(row.code),
        batchId: batchId || null,
        cachedAt: Date.now(),
      }
    }
    sessionStorage.setItem(CARD_CODE_CACHE_KEY, JSON.stringify(stored))
  } catch {
    // ignore quota / parse errors
  }
}

export function getCachedCardCode(cardId) {
  if (typeof sessionStorage === 'undefined' || !cardId) return null
  try {
    const stored = JSON.parse(sessionStorage.getItem(CARD_CODE_CACHE_KEY) || '{}')
    return stored[cardId] || null
  } catch {
    return null
  }
}

export function downloadAccessCardsCsv(codes) {
  const header = 'cardId,code,acreLimit,durationMonths,qrUrl\n'
  const rows = (codes || [])
    .map(
      (row) =>
        `${row.cardId || ''},${row.code},${row.acreLimit},${row.durationMonths},${row.qrUrl || ''}`,
    )
    .join('\n')
  return header + rows
}
