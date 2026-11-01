import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Loader2,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  X,
  User2,
  BriefcaseBusiness,
  Network,
  BellRing,
  Info,
  AlertCircle,
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import {
  checkAssignmentAvailability,
  checkInviteUser,
  createInvitation,
  fetchCrmAdmins,
} from '@/lib/usermanagement'
import { isValidIndianMobile, normalizeIndianPhone } from '@/lib/phone'
import { fetchCountries, fetchStates, fetchCitiesByState } from '@/lib/location'
import { useAuth } from '@/hooks/useAuth'
import {
  ADMIN_ROLES,
  MAX_SUPER_ADMINS,
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
  getDefaultGeoForActor,
} from '@/lib/adminHierarchy'

/** Match a stored geo value (code like "MH" or name like "KERALA") to a dropdown row. */
function findGeoOption(options, value) {
  const v = String(value || '').trim().toUpperCase()
  if (!v) return null
  return (
    options.find((o) => o.code?.toUpperCase() === v) ||
    options.find((o) => o.name?.toUpperCase() === v) ||
    options.find((o) => o.name?.toUpperCase().startsWith(v) || v.startsWith(o.name?.toUpperCase() || '\u0000')) ||
    null
  )
}

/** "+919322396236" → "9322396236" for the 10-digit input next to the +91 box. */
function toLocalMobile(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  return digits.length === 10 ? digits : String(phone || '')
}

export default function InviteUserForm() {
  const navigate = useNavigate()
  const { hierarchy } = useAuth()
  const actor = hierarchy?.actor
  const availableRoles = useMemo(
    () => filterRolesForActor(actor),
    [actor],
  )
  const defaultGeo = useMemo(() => getDefaultGeoForActor(actor), [actor])
  const [activeRole, setActiveRole] = useState(
    availableRoles[availableRoles.length - 1]?.level || 'district',
  )
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState(defaultGeo.countryCode)
  const [stateCode, setStateCode] = useState(defaultGeo.stateCode)
  const [districtCode, setDistrictCode] = useState(defaultGeo.districtCode)
  const [reportsToUserId, setReportsToUserId] = useState('')
  const [managers, setManagers] = useState([])
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [sendEmail, setSendEmail] = useState(true)
  const [sendSms, setSendSms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scopeStatus, setScopeStatus] = useState(null)
  const [checkingScope, setCheckingScope] = useState(false)
  const [inviteUserStatus, setInviteUserStatus] = useState(null)
  const [checkingInviteUser, setCheckingInviteUser] = useState(false)
  // Existing account whose details were loaded into the form (by id), and
  // which values we filled so later edits by the admin are never overwritten.
  const [prefilledUserId, setPrefilledUserId] = useState(null)
  const prefilledValues = useRef({})
  // Region to select once the async state/district lists have loaded.
  const geoPrefill = useRef(null)
  const existingUser = inviteUserStatus?.existingUser || null

  useEffect(() => {
    if (!availableRoles.some((role) => role.level === activeRole)) {
      setActiveRole(availableRoles[availableRoles.length - 1]?.level || 'district')
    }
  }, [availableRoles, activeRole])

  useEffect(() => {
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
        if (active) setManagers(res?.admins || [])
      })
      .catch(() => {
        if (active) setManagers([])
      })
    return () => {
      active = false
    }
  }, [activeRole, countryCode, stateCode, districtCode])

  useEffect(() => {
    let active = true
    setLoadingCountries(true)
    fetchCountries()
      .then((rows) => {
        if (!active) return
        const filtered = filterCountriesForActor(actor, rows)
        setCountries(filtered)
        if (!countryCode && filtered[0]?.code) {
          setCountryCode(filtered[0].code)
        }
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
  }, [actor])

  useEffect(() => {
    if (!countryCode) {
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
        const wanted = findGeoOption(filtered, geoPrefill.current?.state)
        if (geoPrefill.current) geoPrefill.current.state = null
        setStateCode((prev) => {
          if (wanted) return wanted.code
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
  }, [countryCode])

  useEffect(() => {
    if (!stateCode) {
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
        const wanted = findGeoOption(filtered, geoPrefill.current?.district)
        if (geoPrefill.current) geoPrefill.current.district = null
        setDistrictCode((prev) => {
          if (wanted) return wanted.code
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
  }, [stateCode])

  const roleMeta = useMemo(
    () =>
      availableRoles.find((role) => role.level === activeRole) ||
      ADMIN_ROLES.find((role) => role.level === activeRole) ||
      availableRoles[0],
    [activeRole, availableRoles],
  )

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
    sendEmail,
    sendSms,
  ])

  useEffect(() => {
    let active = true
    const timer = setTimeout(async () => {
      const params = {
        level: activeRole,
        countryCode: needsCountry(activeRole) ? countryCode : undefined,
        stateCode: needsState(activeRole) ? stateCode : undefined,
        districtCode: needsDistrict(activeRole) ? districtCode : undefined,
      }

      if (needsCountry(activeRole) && !countryCode) {
        setScopeStatus(null)
        return
      }
      if (needsState(activeRole) && !stateCode) {
        setScopeStatus(null)
        return
      }
      if (needsDistrict(activeRole) && !districtCode) {
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
  }, [activeRole, countryCode, stateCode, districtCode])

  useEffect(() => {
    let active = true
    const timer = setTimeout(async () => {
      const trimmedPhone = phone.trim()
      const trimmedEmail = email.trim()
      const normalizedPhone = trimmedPhone ? normalizeIndianPhone(trimmedPhone) : null
      const hasValidPhone = trimmedPhone && isValidIndianMobile(trimmedPhone)
      const hasEmail = Boolean(trimmedEmail)

      if (!hasValidPhone && !hasEmail) {
        setInviteUserStatus(null)
        return
      }

      setCheckingInviteUser(true)
      try {
        const result = await checkInviteUser({
          phone: hasValidPhone ? normalizedPhone : undefined,
          email: hasEmail ? trimmedEmail : undefined,
        })
        if (!active) return
        setInviteUserStatus(result)
      } catch (err) {
        if (!active) return
        setInviteUserStatus({
          canInvite: false,
          message: err.message || 'Failed to check phone or email.',
        })
      } finally {
        if (active) setCheckingInviteUser(false)
      }
    }, 400)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [phone, email])

  // Existing account found → load their details into the form (once per account).
  useEffect(() => {
    if (!existingUser?.id) {
      if (prefilledUserId && !checkingInviteUser) setPrefilledUserId(null)
      return
    }
    if (existingUser.id === prefilledUserId) return

    const prev = prefilledValues.current
    const next = {}
    // Only fill fields that are empty or still hold what we filled before
    // (e.g. switching from one matched account to another).
    const canFill = (current, key) => !current.trim() || current === prev[key]

    if (existingUser.name && canFill(fullName, 'name')) {
      setFullName(existingUser.name)
      next.name = existingUser.name
    }
    if (existingUser.email && canFill(email, 'email')) {
      setEmail(existingUser.email)
      next.email = existingUser.email
    }
    const localPhone = existingUser.phone ? toLocalMobile(existingUser.phone) : ''
    if (localPhone && canFill(phone, 'phone')) {
      setPhone(localPhone)
      next.phone = localPhone
    }
    prefilledValues.current = next

    // Region: country → state → district (district falls back to city, which
    // is where the farmer app stores it).
    const wantState = existingUser.state
    const wantDistrict = existingUser.district || existingUser.city
    if (existingUser.country || wantState) {
      geoPrefill.current = { state: wantState, district: wantDistrict }
      const country = findGeoOption(countries, existingUser.country)
      if (country && country.code !== countryCode) {
        setCountryCode(country.code) // states effect picks up geoPrefill.state
      } else {
        const st = findGeoOption(states, wantState)
        geoPrefill.current.state = null
        if (st && st.code !== stateCode) {
          setStateCode(st.code) // districts effect picks up geoPrefill.district
        } else {
          const d = findGeoOption(districts, wantDistrict)
          geoPrefill.current.district = null
          if (d) setDistrictCode(d.code)
        }
      }
    }

    setPrefilledUserId(existingUser.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingUser?.id, checkingInviteUser])

  const clearExistingUser = () => {
    const prev = prefilledValues.current
    if (prev.name && fullName === prev.name) setFullName('')
    setEmail('')
    setPhone('')
    prefilledValues.current = {}
    geoPrefill.current = null
    setPrefilledUserId(null)
    setInviteUserStatus(null)
  }

  const scopeGeoReady = isScopeGeoReady(activeRole, {
    countryCode,
    stateCode,
    districtCode,
  })
  const needsUniqueSlot = activeRole !== 'ground'
  const canAssignScope =
    scopeGeoReady &&
    (!needsUniqueSlot || (scopeStatus?.canAssign === true && !checkingScope))
  const hasValidInvitePhone = phone.trim() && isValidIndianMobile(phone)
  const hasInviteEmail = Boolean(email.trim())
  const needsInviteUserCheck = hasValidInvitePhone || hasInviteEmail
  const canInviteUser =
    !needsInviteUserCheck ||
    (!checkingInviteUser && inviteUserStatus?.canInvite === true)
  const canSubmit =
    fullName.trim() &&
    phone.trim() &&
    (!sendEmail || email.trim()) &&
    scopeGeoReady &&
    canAssignScope &&
    canInviteUser &&
    !checkingScope &&
    !checkingInviteUser

  const handleContinue = async () => {
    if (!canSubmit) {
      setError(
        sendEmail
          ? 'Name, email, and mobile number are required'
          : 'Name and mobile number are required'
      )
      return
    }

    if (phone.trim() && !isValidIndianMobile(phone)) {
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

    if (inviteUserStatus?.canInvite === false) {
      setError(
        inviteUserStatus?.message ||
          'This phone or email cannot be used for a new invitation.'
      )
      return
    }

    setError('')
    try {
      setLoading(true)
      const normalizedPhone = phone.trim() ? normalizeIndianPhone(phone) : null
      const payload = {
        fullName: fullName.trim(),
        email: email.trim() || null,
        phone: normalizedPhone,
        level: activeRole,
        countryCode: needsCountry(activeRole) ? countryCode : null,
        stateCode: needsState(activeRole) ? stateCode : null,
        districtCode: needsDistrict(activeRole) ? districtCode : null,
        reportsToUserId: reportsToUserId || null,
        sendEmail,
        sendSms,
      }
      const result = await createInvitation(payload)
      navigate('/invitation-sent', {
        state: {
          invitation: {
            ...payload,
            // Readable region for the confirmation page (it only had codes).
            countryName: payload.countryCode
              ? countries.find((c) => c.code === payload.countryCode)?.name
              : null,
            stateName: payload.stateCode
              ? states.find((s) => s.code === payload.stateCode)?.name
              : null,
            districtName: payload.districtCode
              ? districts.find((d) => d.code === payload.districtCode)?.name
              : null,
          },
          response: result,
          emailSent: result?.emailSent,
          emailError: result?.emailError,
        },
      })
    } catch (err) {
      setError(err.message || 'Failed to create invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_0.8fr]">
      <div className="rounded-[22px] border border-[#E3E8E6] bg-white p-5 shadow-sm">
        {error ? (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-brand-primary" />
          <h2 className="text-[17px] font-semibold text-[#202939]">
            Basic Information
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Full Name
            </label>
            <input
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Email Address {sendEmail ? '(required)' : ''}
            </label>
            <input
              placeholder="john.doe@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[12px] font-medium text-[#374151]">
            Mobile Number (India) (required)
          </label>
          <div className="flex gap-3">
            <div className="flex h-11 w-[95px] items-center justify-center rounded-xl border border-[#CBD5D1] px-4">
              <span className="text-[13px] text-[#111827]">+91</span>
            </div>
            <input
              placeholder="10-digit mobile"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {checkingInviteUser ? (
          <p className="mt-3 flex items-center gap-2 text-[12px] text-[#6B7280]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Checking whether this phone or email is already registered...
          </p>
        ) : null}

        {!checkingInviteUser && existingUser && inviteUserStatus?.canInvite ? (
          <div
            role="status"
            className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
                  {(existingUser.name || existingUser.email || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#1F2937]">
                    <UserCheck className="h-4 w-4 text-emerald-700" />
                    {existingUser.name || 'Registered user'}
                    <span
                      className={clsx(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                        existingUser.isFarmer
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-200 text-gray-700',
                      )}
                    >
                      {existingUser.isFarmer ? 'Farmer' : existingUser.role || 'User'}
                    </span>
                    {existingUser.isFarmer ? (
                      <span className="text-[11px] font-medium text-emerald-800">→ CRM staff</span>
                    ) : null}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#4B5563]">
                    {existingUser.phone ? (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {existingUser.phone}
                      </span>
                    ) : null}
                    {existingUser.email ? (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {existingUser.email}
                      </span>
                    ) : null}
                    {[existingUser.village, existingUser.district || existingUser.city, existingUser.state]
                      .filter(Boolean).length ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {[existingUser.village, existingUser.district || existingUser.city, existingUser.state]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-emerald-900">
                    {inviteUserStatus.message} Review the details and region below, then send the
                    invitation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearExistingUser}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-500 hover:bg-white hover:text-gray-700"
                title="Clear the loaded details and enter someone else"
              >
                <X className="h-3.5 w-3.5" />
                Not this person?
              </button>
            </div>
          </div>
        ) : null}

        {!checkingInviteUser && inviteUserStatus?.message && !(existingUser && inviteUserStatus?.canInvite) ? (
          <div
            role="status"
            className={clsx(
              'mt-3 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
              inviteUserStatus.canInvite
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            )}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{inviteUserStatus.message}</p>
          </div>
        ) : null}

        <div className="mt-8 flex items-center gap-2">
          <Network className="h-4 w-4 text-brand-primary" />
          <h2 className="text-[17px] font-semibold text-[#202939]">
            Assignment Scope
          </h2>
        </div>
        <p className="mt-2 text-[12px] text-[#6B7280]">
          Choose the region first. Only one admin is allowed per country, state, or district.
          Multiple agents can share the same district.
        </p>

        {activeRole === 'super' ? (
          <p className="mt-3 text-[13px] text-[#6B7280]">
            Super Admin covers the full organization. Up to {MAX_SUPER_ADMINS} active Super Admins are allowed.
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
                className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
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
                className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
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
                className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
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

        {checkingScope ? (
          <p className="mt-3 text-[12px] text-[#6B7280]">
            Checking whether this admin slot is available...
          </p>
        ) : null}

        {!checkingScope && scopeStatus?.message ? (
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

        <div className="mt-8 flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-brand-primary" />
          <h2 className="text-[17px] font-semibold text-[#202939]">
            Select User Role
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {availableRoles.map((role) => (
            <button
              key={role.title}
              type="button"
              className={clsx(
                'relative rounded-2xl border p-4 text-left transition',
                activeRole === role.level
                  ? 'border-brand-primary bg-[#ECF7F3]'
                  : 'border-[#CBD5D1] bg-white hover:border-brand-primary'
              )}
              onClick={() => setActiveRole(role.level)}
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

        <div className="mt-8 flex items-center gap-2">
          <Network className="h-4 w-4 text-brand-primary" />
          <h2 className="text-[17px] font-semibold text-[#202939]">
            Reporting Hierarchy
          </h2>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-[12px] font-medium text-[#374151]">
            Reports To
          </label>
          <select
            value={reportsToUserId}
            onChange={(e) => setReportsToUserId(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
          >
            <option value="">Select manager (optional)</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.role}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <BellRing className="h-4 w-4 text-brand-primary" />
          <h2 className="text-[17px] font-semibold text-[#202939]">
            Invitation Preferences
          </h2>
        </div>

        <div className="mt-5 space-y-3">
          {[
            {
              label: 'Send Email Invitation',
              active: sendEmail,
              toggle: () => setSendEmail((prev) => !prev),
            },
            {
              label: 'Send SMS Invitation',
              active: sendSms,
              toggle: () => setSendSms((prev) => !prev),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-[#CBD5D1] px-5 py-3"
            >
              <p className="text-[14px] text-[#202939]">{item.label}</p>
              <button
                type="button"
                onClick={item.toggle}
                className={clsx(
                  'flex h-6 w-11 cursor-pointer items-center rounded-full px-1 transition',
                  item.active
                    ? 'justify-end bg-brand-primary'
                    : 'justify-start bg-[#D1D8D5]'
                )}
              >
                <div className="h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[#6B7280]">
          {sendEmail
            ? 'We email a verification link. After they verify, they receive login steps (WhatsApp OTP).'
            : 'Turn on email invitation to send a verification link automatically.'}
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-[22px] border border-[#E3E8E6] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-brand-primary" />
            <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#4B5563]">
              Role Summary
            </h3>
          </div>

          <h2 className="mt-5 text-[17px] font-semibold text-brand-primary">
            {roleMeta.title}
          </h2>

          <p className="mt-3 text-[13px] leading-6 text-[#4B5563]">
            {roleMeta.desc} Scope is enforced by admin level and region codes on the server.
          </p>
        </div>

        <div className="rounded-[22px] bg-gradient-to-br from-brand-primary to-brand-950 p-6 text-white">
          <p className="text-[15px] leading-7 text-white/90">
            Invited users receive CRM access based on their assigned admin level and
            region scope.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={loading || !canSubmit}
            onClick={handleContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-brand-950 disabled:opacity-60"
          >
            {loading
              ? 'Creating invitation...'
              : existingUser?.isFarmer && inviteUserStatus?.canInvite
                ? 'Upgrade to staff & invite'
                : 'Send invitation'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
