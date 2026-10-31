// Same backend as every other CRM request (falls back to production).
import { API_BASE_URL } from '@/lib/api'

export async function fetchInvitationByToken(token) {
  const response = await fetch(
    `${API_BASE_URL}/crm/invitations/accept/${encodeURIComponent(token)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Brand': 'biodrops',
        'X-Client-App': 'satagro_crm',
      },
    }
  )
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const err = new Error(data?.message || 'Failed to load invitation')
    err.status = response.status
    throw err
  }
  return data
}

export async function acceptInvitation(token, { acceptTerms = true } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/crm/invitations/accept/${encodeURIComponent(token)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Brand': 'biodrops',
        'X-Client-App': 'satagro_crm',
      },
      body: JSON.stringify({ acceptTerms }),
    }
  )
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to verify invitation')
  }
  return data
}
