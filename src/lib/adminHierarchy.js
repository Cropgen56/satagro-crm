import {
  ADMIN_LEVEL_ORDER,
  ADMIN_LEVEL_RANK,
  ADMIN_ROLES,
} from '@/lib/adminRoles'

const PLATFORM_CRM_ROLES = new Set(['admin', 'developer'])

const ADMIN_PARENT_LEVEL = {
  country: 'super',
  state: 'country',
  district: 'state',
  ground: 'district',
}

function normalizeCode(value) {
  if (value == null || value === '') return null
  return String(value).trim().toUpperCase()
}

function tenantKey(tenantId) {
  if (tenantId == null) return null
  return String(tenantId)
}

function getHighestAdminLevel(assignments = []) {
  let max = 0
  let level = null
  for (const a of assignments) {
    const rank = ADMIN_LEVEL_RANK[a.level] || 0
    if (rank > max) {
      max = rank
      level = a.level
    }
  }
  return level
}

function assignmentCoversTarget(assignment, target) {
  const aTenant = tenantKey(assignment.tenantId)
  const tTenant = tenantKey(target.tenantId)
  if (aTenant !== tTenant) return false

  if (assignment.level === 'super') return true

  const aCountry = normalizeCode(assignment.countryCode)
  const tCountry = normalizeCode(target.countryCode)
  if (assignment.level === 'country') {
    return aCountry && aCountry === tCountry
  }

  const aState = normalizeCode(assignment.stateCode)
  const tState = normalizeCode(target.stateCode)
  if (assignment.level === 'state') {
    return aCountry === tCountry && aState && aState === tState
  }

  const aDistrict = normalizeCode(assignment.districtCode)
  const tDistrict = normalizeCode(target.districtCode)
  if (assignment.level === 'district') {
    return (
      aCountry === tCountry &&
      aState === tState &&
      aDistrict &&
      aDistrict === tDistrict
    )
  }

  if (assignment.level === 'ground') {
    const geoOk =
      aCountry === tCountry && aState === tState && aDistrict === tDistrict
    if (!geoOk) return false
    const aManaged = assignment.managedOrganizationId
      ? String(assignment.managedOrganizationId)
      : null
    const tManaged = target.managedOrganizationId
      ? String(target.managedOrganizationId)
      : null
    if (aManaged && tManaged) return aManaged === tManaged
    return true
  }

  return false
}

export function buildActorFromSession(user, assignments = []) {
  return {
    id: user?.id || user?._id || null,
    role: user?.role,
    adminAssignments: assignments,
    highestAdminLevel: getHighestAdminLevel(assignments),
    isPlatformAdmin: PLATFORM_CRM_ROLES.has(user?.role),
  }
}

export function canManageAssignment(actor, targetAssignment) {
  if (!actor || !targetAssignment) return false
  if (PLATFORM_CRM_ROLES.has(actor.role)) return true

  const assignments = actor.adminAssignments || []
  if (!assignments.length) return false

  const targetRank = ADMIN_LEVEL_RANK[targetAssignment.level] || 0

  for (const a of assignments) {
    const actorRank = ADMIN_LEVEL_RANK[a.level] || 0
    if (actorRank <= targetRank) continue
    if (assignmentCoversTarget(a, targetAssignment)) return true
  }

  return false
}

export function canCreateAssignment(actor, newAssignment) {
  if (!actor || !newAssignment) return false
  if (PLATFORM_CRM_ROLES.has(actor.role)) return true

  const assignments = actor.adminAssignments || []
  const parentLevel = ADMIN_PARENT_LEVEL[newAssignment.level]

  if (!parentLevel) {
    return assignments.some((a) => a.level === 'super')
  }

  const parentTarget = {
    level: parentLevel,
    tenantId: newAssignment.tenantId,
    countryCode: newAssignment.countryCode,
    stateCode: parentLevel === 'country' ? null : newAssignment.stateCode,
    districtCode:
      parentLevel === 'district' || parentLevel === 'state'
        ? newAssignment.districtCode
        : null,
    managedOrganizationId: null,
  }

  if (parentLevel === 'country') {
    parentTarget.stateCode = null
    parentTarget.districtCode = null
  } else if (parentLevel === 'state') {
    parentTarget.districtCode = null
  }

  // Country admin's parent is super — same rank as the actor, so use tenant check.
  if (parentLevel === 'super') {
    const tid = tenantKey(newAssignment.tenantId)
    return assignments.some(
      (a) => a.level === 'super' && tenantKey(a.tenantId) === tid,
    )
  }

  return canManageAssignment(actor, parentTarget)
}

function buildAssignmentShape(level, tenantId, geo = {}) {
  const countryCode =
    level === 'super' ? null : normalizeCode(geo.countryCode) || null
  const stateCode =
    level === 'super' || level === 'country'
      ? null
      : normalizeCode(geo.stateCode) || null
  const districtCode =
    level === 'super' || level === 'country' || level === 'state'
      ? null
      : normalizeCode(geo.districtCode) || null

  return {
    level,
    tenantId: tenantId == null ? null : String(tenantId),
    countryCode,
    stateCode,
    districtCode,
    managedOrganizationId: geo.managedOrganizationId ?? null,
  }
}

function probeGeosForCreatableCheck(actor) {
  const geos = [{ countryCode: null, stateCode: null, districtCode: null }]
  for (const a of actor?.adminAssignments || []) {
    geos.push({
      countryCode: a.countryCode || null,
      stateCode: a.stateCode || null,
      districtCode: a.districtCode || null,
    })
  }
  return geos
}

/** Real BioDrops tenant id from assignments — required for scope checks. */
export function resolveActorTenantId(actor) {
  if (!actor) return null
  for (const a of actor.adminAssignments || []) {
    if (a.tenantId != null && a.tenantId !== '') {
      return String(a.tenantId)
    }
  }
  return null
}

export function getCreatableLevels(actor) {
  if (!actor) return []
  if (PLATFORM_CRM_ROLES.has(actor.role)) return [...ADMIN_LEVEL_ORDER]

  const tenantId = resolveActorTenantId(actor)
  if (!tenantId) return []

  const creatable = new Set()
  for (const level of ADMIN_LEVEL_ORDER) {
    for (const geo of probeGeosForCreatableCheck(actor)) {
      const shape = buildAssignmentShape(level, tenantId, geo)
      if (canCreateAssignment(actor, shape)) {
        creatable.add(level)
        break
      }
    }
  }

  let levels = ADMIN_LEVEL_ORDER.filter((level) => creatable.has(level))

  // Super admins invite roles below them; another super slot is rarely needed here.
  const highest = getHighestAdminLevel(actor.adminAssignments || [])
  if (highest === 'super') {
    levels = levels.filter((level) => level !== 'super')
  }

  return levels
}

export function summarizeActorGeoScope(actor) {
  if (PLATFORM_CRM_ROLES.has(actor?.role)) {
    return { mode: 'unrestricted', highestLevel: null }
  }

  const assignments = actor?.adminAssignments || []
  if (assignments.some((a) => a.level === 'super')) {
    return { mode: 'unrestricted', highestLevel: 'super' }
  }

  const countries = new Set()
  const states = []
  const districts = []
  const stateKeys = new Set()
  const districtKeys = new Set()

  for (const a of assignments) {
    const cc = normalizeCode(a.countryCode)
    const st = normalizeCode(a.stateCode)
    const dt = normalizeCode(a.districtCode)

    if (cc) countries.add(cc)
    if (cc && st) {
      const key = `${cc}:${st}`
      if (!stateKeys.has(key)) {
        stateKeys.add(key)
        states.push({ countryCode: cc, stateCode: st })
      }
    }
    if (cc && st && dt) {
      const key = `${cc}:${st}:${dt}`
      if (!districtKeys.has(key)) {
        districtKeys.add(key)
        districts.push({ countryCode: cc, stateCode: st, districtCode: dt })
      }
    }
  }

  return {
    mode: 'scoped',
    highestLevel: getHighestAdminLevel(assignments),
    countries: [...countries],
    states,
    districts,
  }
}

export function buildHierarchyFromSession(user, assignments = []) {
  const actor = buildActorFromSession(user, assignments)
  return {
    actor,
    highestLevel: actor.highestAdminLevel,
    isPlatformAdmin: actor.isPlatformAdmin,
    creatableLevels: getCreatableLevels(actor),
    geoScope: summarizeActorGeoScope(actor),
    canInvite: getCreatableLevels(actor).length > 0,
  }
}

export function filterRolesForActor(actor, { includeLevel = null } = {}) {
  const creatable = new Set(getCreatableLevels(actor))
  if (includeLevel) creatable.add(includeLevel)
  return ADMIN_ROLES.filter((role) => creatable.has(role.level))
}

export function canManageUser(actor, user) {
  if (!user?.adminLevel) return PLATFORM_CRM_ROLES.has(actor?.role)
  if (user.canManage != null) return Boolean(user.canManage)
  const tenantId = resolveActorTenantId(actor)
  if (!tenantId) return false
  return canManageAssignment(
    actor,
    buildAssignmentShape(user.adminLevel, tenantId, {
      countryCode: user.country,
      stateCode: user.state,
      districtCode: user.district,
    }),
  )
}

export function canSelectCountry(actor, countryCode) {
  const scope = summarizeActorGeoScope(actor)
  if (scope.mode === 'unrestricted') return true
  const code = normalizeCode(countryCode)
  return scope.countries.includes(code)
}

export function canSelectState(actor, countryCode, stateCode) {
  const scope = summarizeActorGeoScope(actor)
  if (scope.mode === 'unrestricted') return true
  const cc = normalizeCode(countryCode)
  const st = normalizeCode(stateCode)
  if (scope.highestLevel === 'country') {
    return scope.countries.includes(cc)
  }
  return scope.states.some(
    (row) => row.countryCode === cc && row.stateCode === st,
  )
}

export function canSelectDistrict(actor, countryCode, stateCode, districtCode) {
  const scope = summarizeActorGeoScope(actor)
  if (scope.mode === 'unrestricted') return true
  const cc = normalizeCode(countryCode)
  const st = normalizeCode(stateCode)
  const dt = normalizeCode(districtCode)
  if (scope.highestLevel === 'country' || scope.highestLevel === 'state') {
    return canSelectState(actor, cc, st)
  }
  return scope.districts.some(
    (row) =>
      row.countryCode === cc &&
      row.stateCode === st &&
      row.districtCode === dt,
  )
}

export function filterCountriesForActor(actor, countries = []) {
  const scope = summarizeActorGeoScope(actor)
  if (scope.mode === 'unrestricted') return countries
  return countries.filter((c) => scope.countries.includes(normalizeCode(c.code)))
}

export function filterStatesForActor(actor, countryCode, states = []) {
  const scope = summarizeActorGeoScope(actor)
  if (scope.mode === 'unrestricted') return states
  const cc = normalizeCode(countryCode)
  if (scope.highestLevel === 'country') {
    return scope.countries.includes(cc) ? states : []
  }
  const allowed = new Set(
    scope.states
      .filter((row) => row.countryCode === cc)
      .map((row) => row.stateCode),
  )
  return states.filter((s) => allowed.has(normalizeCode(s.code)))
}

export function filterDistrictsForActor(
  actor,
  countryCode,
  stateCode,
  districts = [],
) {
  const scope = summarizeActorGeoScope(actor)
  if (scope.mode === 'unrestricted') return districts
  const cc = normalizeCode(countryCode)
  const st = normalizeCode(stateCode)
  if (scope.highestLevel === 'country' || scope.highestLevel === 'state') {
    return canSelectState(actor, cc, st) ? districts : []
  }
  const allowed = new Set(
    scope.districts
      .filter((row) => row.countryCode === cc && row.stateCode === st)
      .map((row) => row.districtCode),
  )
  return districts.filter((d) => allowed.has(normalizeCode(d.code)))
}

export function getDefaultGeoForActor(actor) {
  const scope = summarizeActorGeoScope(actor)
  if (scope.mode === 'unrestricted') {
    return { countryCode: 'IN', stateCode: 'MH', districtCode: 'PUNE' }
  }
  const countryCode = scope.countries[0] || 'IN'
  const stateRow = scope.states.find((s) => s.countryCode === countryCode)
  const stateCode = stateRow?.stateCode || ''
  const districtRow = scope.districts.find(
    (d) => d.countryCode === countryCode && d.stateCode === stateCode,
  )
  return {
    countryCode,
    stateCode,
    districtCode: districtRow?.districtCode || '',
  }
}

export function hierarchyLevelLabel(level) {
  const role = ADMIN_ROLES.find((r) => r.level === level)
  return role?.title || level
}
