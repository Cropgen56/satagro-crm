import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import {
  User2,
  BriefcaseBusiness,
  Network,
  BellRing,
  Info,
  AlertCircle,
  Check,
  X,
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

const permissions = [
  { label: 'Create Farmer Records', allowed: true },
  { label: 'Update Crop Life Cycle', allowed: true },
  { label: 'Access District Reports', allowed: true },
  { label: 'Delete Organization Data', allowed: false },
]

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
          invitation: payload,
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
          <p className="mt-3 text-[12px] text-[#6B7280]">
            Checking whether this phone or email is already registered...
          </p>
        ) : null}

        {!checkingInviteUser && inviteUserStatus?.message ? (
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

          <div className="my-5 border-t border-[#E5E7EB]" />

          <h4 className="text-[13px] font-semibold text-[#1F2937]">
            Core Permissions:
          </h4>

          <div className="mt-4 space-y-3">
            {permissions.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                {item.allowed ? (
                  <Check className="h-4 w-4 text-[#059669]" />
                ) : (
                  <X className="h-4 w-4 text-[#DC2626]" />
                )}
                <span className="text-[13px] text-[#4B5563]">{item.label}</span>
              </div>
            ))}
          </div>
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
            {loading ? 'Creating invitation...' : 'Send invitation'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
