export const ADMIN_ROLES = [
  {
    title: 'Super Admin',
    desc: 'Full organizational control and management.',
    level: 'super',
  },
  {
    title: 'Country Admin',
    desc: 'Regional oversight for a specific nation.',
    level: 'country',
  },
  {
    title: 'State User',
    desc: 'State-level monitoring and data entry.',
    level: 'state',
  },
  {
    title: 'District Operator',
    desc: 'On-field management of farmer clusters.',
    level: 'district',
  },
  {
    title: 'FPO / Agent',
    desc: 'Frontline contact for farmer organizations.',
    level: 'ground',
  },
]

export const ADMIN_LEVEL_RANK = {
  super: 5,
  country: 4,
  state: 3,
  district: 2,
  ground: 1,
}

export const ADMIN_LEVEL_ORDER = ['super', 'country', 'state', 'district', 'ground']

export function needsCountry(level) {
  return ['country', 'state', 'district', 'ground'].includes(level)
}

export function needsState(level) {
  return ['state', 'district', 'ground'].includes(level)
}

export function needsDistrict(level) {
  return ['district', 'ground'].includes(level)
}

export function isScopeGeoReady(level, { countryCode, stateCode, districtCode }) {
  if (level === 'super') return true
  if (needsCountry(level) && !countryCode) return false
  if (needsState(level) && !stateCode) return false
  if (needsDistrict(level) && !districtCode) return false
  return true
}
