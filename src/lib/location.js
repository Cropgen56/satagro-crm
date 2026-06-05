const LOCATION_API_BASE_URL =
  import.meta.env.VITE_LOCATION_API_BASE_URL || 'https://location.cropgenapp.com'

function pick(obj, keys, fallback = '') {
  for (const key of keys) {
    const value = obj?.[key]
    if (value != null && String(value).trim() !== '') return String(value).trim()
  }
  return fallback
}

function slugCode(value) {
  return String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32)
}

function normalizeCountry(item) {
  return {
    code: pick(item, ['iso2', 'code', 'countryCode', 'country_code', 'isoCode', 'shortCode']).toUpperCase(),
    name: pick(item, ['name', 'countryName', 'country'], 'Unknown'),
  }
}

function normalizeState(item) {
  const name = pick(item, ['name', 'stateName', 'state'], 'Unknown')
  const rawCode = pick(item, ['state_code', 'stateCode', 'code', 'isoCode', 'shortCode'])
  return {
    code: rawCode ? rawCode.toUpperCase() : slugCode(name),
    name,
  }
}

function normalizeCity(item) {
  const name = pick(item, ['name', 'cityName', 'district', 'city'], 'Unknown')
  const rawCode = pick(item, ['code', 'cityCode', 'districtCode', 'district_code', 'id'])
  return {
    code: rawCode ? rawCode.toUpperCase() : slugCode(name),
    name,
  }
}

async function fetchLocationJson(pathname) {
  const response = await fetch(`${LOCATION_API_BASE_URL}${pathname}`)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to load location data')
  }

  if (!data?.success || !Array.isArray(data?.data)) {
    return []
  }

  return data.data
}

export async function fetchCountries() {
  const data = await fetchLocationJson('/api/countries')
  return data.map(normalizeCountry).filter((row) => row.code)
}

export async function fetchStates(countryCode) {
  if (!countryCode) return []
  const data = await fetchLocationJson(`/api/states/${encodeURIComponent(countryCode)}`)
  return data.map(normalizeState).filter((row) => row.code)
}

export async function fetchCitiesByState(stateCode, { page = 1, limit = 100 } = {}) {
  if (!stateCode) return []
  const query = new URLSearchParams({
    state: stateCode,
    page: String(page),
    limit: String(limit),
  })
  const data = await fetchLocationJson(`/api/cities/all?${query.toString()}`)
  return data.map(normalizeCity).filter((row) => row.code)
}

export async function searchCitiesByState(stateCode, queryText = '', { limit = 20 } = {}) {
  if (!stateCode) return []
  const query = new URLSearchParams({
    state: String(stateCode).toUpperCase(),
    q: String(queryText || ''),
    limit: String(limit),
  })
  const data = await fetchLocationJson(`/api/cities?${query.toString()}`)
  return data.map(normalizeCity).filter((row) => row.name)
}
