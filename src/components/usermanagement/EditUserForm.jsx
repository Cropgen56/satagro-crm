import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User2,
  BriefcaseBusiness,
  Network,
  Shield,
  AlertCircle,
  Check,
} from 'lucide-react'
import {
  checkAssignmentAvailability,
  updateCrmUser,
  fetchCrmAdmins,
  fetchUserById,
} from '@/lib/usermanagement'
import { isValidIndianMobile, normalizeIndianPhone } from '@/lib/phone'
import { fetchCountries, fetchStates, fetchCitiesByState } from '@/lib/location'
import { useAuth } from '@/hooks/useAuth'
import {
  ADMIN_ROLES,
  needsCountry,
  needsState,
  needsDistrict,
  isScopeGeoReady,
} from '@/lib/adminRoles'
import {
  filterCountriesForActor,
  filterDistrictsForActor,
  filterRolesForActor,
  filterStatesForActor,
} from '@/lib/adminHierarchy'

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-brand-primary" />
      <h2 className="text-[17px] font-semibold text-[#202939]">{title}</h2>
    </div>
  )
}

function resetFormState(setters) {
  setters.setFullName('')
  setters.setEmail('')
  setters.setPhone('')
  setters.setActiveRole('district')
  setters.setCountryCode('IN')
  setters.setStateCode('')
  setters.setDistrictCode('')
  setters.setReportsToUserId('')
  setters.setAssignmentStatus('active')
  setters.setAccountLabel('')
}

export default function EditUserForm({ userId }) {
  const navigate = useNavigate()
  const { hierarchy } = useAuth()
  const actor = hierarchy?.actor
  const [canManageUser, setCanManageUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileReady, setProfileReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [managers, setManagers] = useState([])
  const [accountLabel, setAccountLabel] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [activeRole, setActiveRole] = useState('district')
  const [countryCode, setCountryCode] = useState('IN')
  const [stateCode, setStateCode] = useState('')
  const [districtCode, setDistrictCode] = useState('')
  const [reportsToUserId, setReportsToUserId] = useState('')
  const [assignmentStatus, setAssignmentStatus] = useState('active')
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [scopeStatus, setScopeStatus] = useState(null)
  const [checkingScope, setCheckingScope] = useState(false)
  const [initialLevel, setInitialLevel] = useState('district')

  const availableRoles = useMemo(
    () => filterRolesForActor(actor, { includeLevel: initialLevel }),
    [actor, initialLevel],
  )

  useEffect(() => {
    let active = true
    setLoadingCountries(true)
    fetchCountries()
      .then((rows) => {
        if (!active) return
        setCountries(filterCountriesForActor(actor, rows))
      })
      .catch(() => {
        if (active) setCountries([])
      })
      .finally(() => {
        if (active) setLoadingCountries(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      if (!userId) return

      setProfileReady(false)
      setError('')
      resetFormState({
        setFullName,
        setEmail,
        setPhone,
        setActiveRole,
        setCountryCode,
        setStateCode,
        setDistrictCode,
        setReportsToUserId,
        setAssignmentStatus,
        setAccountLabel,
      })

      try {
        setLoading(true)
        const userRes = await fetchUserById(userId)
        if (!active) return

        const user = userRes?.user
        if (!user?.canManage) {
          setCanManageUser(false)
          setError('You do not have permission to edit this user.')
          return
        }
        setCanManageUser(true)
        const assignmentList = userRes?.assignments || []
        const primary =
          assignmentList.find((a) => a.status === 'active') || assignmentList[0]

        setFullName(user?.name || '')
        setEmail(user?.email || user?.invitationEmail || '')
        setPhone(user?.phone?.replace(/^\+91/, '') || user?.phone || '')
        const loadedLevel = user?.adminLevel || primary?.level || 'district'
        setInitialLevel(loadedLevel)
        setActiveRole(loadedLevel)
        setCountryCode(primary?.countryCode || user?.country || 'IN')
        setStateCode(primary?.stateCode || '')
        setDistrictCode(primary?.districtCode || '')
        setReportsToUserId(primary?.appointedBy?.id || user?.reportsToId || '')
        setAssignmentStatus(
          user?.assignmentStatus === 'suspended' ? 'suspended' : 'active'
        )
        setAccountLabel(
          [user?.uid, user?.phone].filter(Boolean).join(' · ') || String(userId)
        )

        setProfileReady(true)
      } catch (err) {
        if (active) setError(err.message || 'Failed to load user')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [userId])

  useEffect(() => {
    if (!profileReady || !canManageUser) return

    let active = true
    const params = {
      forLevel: activeRole,
      ...(needsCountry(activeRole) && countryCode
        ? { countryCode }
        : {}),
      ...(needsState(activeRole) && stateCode ? { stateCode } : {}),
      ...(needsDistrict(activeRole) && districtCode
        ? { districtCode }
        : {}),
    }

    fetchCrmAdmins(params)
      .then((res) => {
        if (!active) return
        setManagers((res?.admins || []).filter((a) => a.id !== userId))
      })
      .catch(() => {
        if (active) setManagers([])
      })

    return () => {
      active = false
    }
  }, [
    profileReady,
    canManageUser,
    activeRole,
    countryCode,
    stateCode,
    districtCode,
    userId,
  ])

  const roleMeta = useMemo(
    () =>
      availableRoles.find((r) => r.level === activeRole) ||
      ADMIN_ROLES.find((r) => r.level === activeRole) ||
      availableRoles[0],
    [activeRole, availableRoles],
  )

  useEffect(() => {
    if (!profileReady || !countryCode) {
      if (!profileReady) return
      setStates([])
      setStateCode('')
      return
    }

    let active = true
    setLoadingStates(true)
    fetchStates(countryCode)
      .then((rows) => {
        if (!active) return
        const filtered = filterStatesForActor(actor, countryCode, rows)
        setStates(filtered)
        setStateCode((prev) => {
          if (prev && filtered.some((s) => s.code === prev)) return prev
          return filtered[0]?.code || ''
        })
      })
      .catch(() => {
        if (active) setStates([])
      })
      .finally(() => {
        if (active) setLoadingStates(false)
      })

    return () => {
      active = false
    }
  }, [countryCode, profileReady])

  useEffect(() => {
    if (!profileReady || !stateCode) {
      if (!profileReady) return
      setDistricts([])
      setDistrictCode('')
      return
    }

    let active = true
    setLoadingDistricts(true)
    fetchCitiesByState(stateCode, { limit: 500 })
      .then((rows) => {
        if (!active) return
        const filtered = filterDistrictsForActor(
          actor,
          countryCode,
          stateCode,
          rows,
        )
        setDistricts(filtered)
        setDistrictCode((prev) => {
          if (prev && filtered.some((d) => d.code === prev)) return prev
          return filtered[0]?.code || ''
        })
      })
      .catch(() => {
        if (active) {
          setDistricts([])
          setDistrictCode('')
        }
      })
      .finally(() => {
        if (active) setLoadingDistricts(false)
      })

    return () => {
      active = false
    }
  }, [stateCode, profileReady])

  useEffect(() => {
    if (error) setError('')
  }, [
    fullName,
    email,
    phone,
    activeRole,
    countryCode,
    stateCode,
    districtCode,
    reportsToUserId,
    assignmentStatus,
  ])

  useEffect(() => {
    if (!profileReady) return

    if (assignmentStatus === 'suspended') {
      setScopeStatus(null)
      return
    }

    let active = true
    const timer = setTimeout(async () => {
      const params = {
        level: activeRole,
        excludeUserId: userId,
        countryCode: needsCountry(activeRole) ? countryCode : undefined,
        stateCode: needsState(activeRole) ? stateCode : undefined,
        districtCode: needsDistrict(activeRole) ? districtCode : undefined,
      }

      if (!isScopeGeoReady(activeRole, { countryCode, stateCode, districtCode })) {
        setScopeStatus(null)
        return
      }

      setCheckingScope(true)
      try {
        const result = await checkAssignmentAvailability(params)
        if (!active) return
        setScopeStatus(result)
      } catch (err) {
        if (!active) return
        setScopeStatus({
          available: false,
          canAssign: false,
          message: err.message || 'Failed to check assignment availability.',
        })
      } finally {
        if (active) setCheckingScope(false)
      }
    }, 300)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [
    activeRole,
    countryCode,
    stateCode,
    districtCode,
    assignmentStatus,
    userId,
    profileReady,
  ])

  const scopeGeoReady = isScopeGeoReady(activeRole, {
    countryCode,
    stateCode,
    districtCode,
  })
  const needsUniqueSlot = activeRole !== 'ground' && assignmentStatus === 'active'
  const canAssignScope =
    assignmentStatus === 'suspended' ||
    (scopeGeoReady &&
      (!needsUniqueSlot || (scopeStatus?.canAssign === true && !checkingScope)))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }
    if (!phone.trim() || !isValidIndianMobile(phone)) {
      setError('Enter a valid 10-digit Indian mobile number')
      return
    }
    if (!canAssignScope) {
      setError(
        scopeStatus?.message ||
          'This admin role is already assigned for the selected region.'
      )
      return
    }

    setError('')
    try {
      setSaving(true)
      await updateCrmUser(userId, {
        fullName: fullName.trim(),
        email: email.trim() || null,
        phone: normalizeIndianPhone(phone),
        level: activeRole,
        countryCode: needsCountry(activeRole) ? countryCode : null,
        stateCode: needsState(activeRole) ? stateCode : null,
        districtCode: needsDistrict(activeRole) ? districtCode : null,
        reportsToUserId: reportsToUserId || null,
        assignmentStatus,
      })
      navigate(`/user-management/${userId}`)
    } catch (err) {
      setError(err.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading user...</p>
  }

  if (!canManageUser) {
    return (
      <div className="rounded-[22px] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p>{error || 'You do not have permission to edit this user.'}</p>
        <button
          type="button"
          onClick={() => navigate(`/user-management/${userId}`)}
          className="mt-4 text-sm font-semibold text-brand-primary hover:underline"
        >
          Back to user details
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-[22px] border border-[#E3E8E6] bg-white p-6 shadow-sm"
    >
      {error ? (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <h2 className="text-lg font-semibold text-brand-primary">Edit user</h2>
      <p className="mt-1 text-sm text-gray-500">
        Update profile details, region scope, role, and access for this CRM user.
      </p>
      {accountLabel ? (
        <p className="mt-2 text-xs font-medium text-gray-400">
          Account: {accountLabel}
        </p>
      ) : null}

      <div className="mt-8">
        <SectionHeader icon={User2} title="Basic Information" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Full name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Mobile (+91)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Access status
            </label>
            <select
              value={assignmentStatus}
              onChange={(e) => setAssignmentStatus(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SectionHeader icon={Network} title="Assignment Scope" />
        <p className="mt-2 text-[12px] text-[#6B7280]">
          Choose the region first. Only one admin is allowed per country, state, or district.
          Multiple agents can share the same district.
        </p>

        {activeRole === 'super' ? (
          <p className="mt-3 text-[13px] text-[#6B7280]">
            Super Admin covers the full organization. Up to 5 active Super Admins are allowed.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-[12px] font-medium text-[#374151]">
                Country
              </label>
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value)
                  setStateCode('')
                  setDistrictCode('')
                }}
                className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
                disabled={loadingCountries}
              >
                <option value="">
                  {loadingCountries ? 'Loading countries...' : 'Select country'}
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-medium text-[#374151]">
                State
              </label>
              <select
                value={stateCode}
                onChange={(e) => {
                  setStateCode(e.target.value)
                  setDistrictCode('')
                }}
                className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
                disabled={loadingStates || !countryCode}
              >
                <option value="">
                  {loadingStates ? 'Loading states...' : 'Select state'}
                </option>
                {states.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-medium text-[#374151]">
                District
              </label>
              <select
                value={districtCode}
                onChange={(e) => setDistrictCode(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
                disabled={loadingDistricts || !stateCode}
              >
                <option value="">
                  {loadingDistricts ? 'Loading districts...' : 'Select district'}
                </option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {assignmentStatus === 'active' && checkingScope ? (
          <p className="mt-3 text-[12px] text-[#6B7280]">
            Checking whether this admin slot is available...
          </p>
        ) : null}

        {assignmentStatus === 'active' && !checkingScope && scopeStatus?.message ? (
          <div
            role="status"
            className={clsx(
              'mt-3 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
              scopeStatus.canAssign
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            )}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{scopeStatus.message}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        <SectionHeader icon={BriefcaseBusiness} title="Select User Role" />
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {availableRoles.map((role) => (
            <button
              key={role.level}
              type="button"
              onClick={() => setActiveRole(role.level)}
              className={clsx(
                'relative rounded-2xl border p-4 text-left transition',
                activeRole === role.level
                  ? 'border-brand-primary bg-[#ECF7F3]'
                  : 'border-[#CBD5D1] bg-white hover:border-brand-primary'
              )}
            >
              {activeRole === role.level && (
                <div className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <p
                className={clsx(
                  'text-[14px] font-semibold',
                  activeRole === role.level
                    ? 'text-brand-primary'
                    : 'text-[#1F2937]'
                )}
              >
                {role.title}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">
                {role.desc}
              </p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[#6B7280]">
          Selected role: <span className="font-semibold text-[#202939]">{roleMeta.title}</span>
        </p>
      </div>

      <div className="mt-8">
        <SectionHeader icon={Shield} title="Reporting Hierarchy" />
        <div className="mt-5 max-w-md">
          <label className="mb-2 block text-[12px] font-medium text-[#374151]">
            Reports to
          </label>
          <select
            value={reportsToUserId}
            onChange={(e) => setReportsToUserId(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
          >
            <option value="">Select manager (optional)</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-[#E5E7EB] pt-6">
        <button
          type="submit"
          disabled={saving || !canAssignScope}
          className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/user-management/${userId}`)}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
