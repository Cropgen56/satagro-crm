/** Normalize Indian mobile input to E.164 (+91XXXXXXXXXX). */
export function normalizeIndianPhone(input) {
  const digits = String(input || '').replace(/\D/g, '')
  if (!digits) return null
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  if (digits.length >= 11 && digits.length <= 15) return `+${digits}`
  return null
}

export function isValidIndianMobile(input) {
  const normalized = normalizeIndianPhone(input)
  return normalized != null && /^\+91\d{10}$/.test(normalized)
}

export function maskPhone(phone) {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return phone
  return `+${digits.startsWith('91') ? '91 ' : ''}******${digits.slice(-4)}`
}
