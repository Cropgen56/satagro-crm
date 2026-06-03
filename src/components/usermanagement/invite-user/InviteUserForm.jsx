import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import {
  User2,
  BriefcaseBusiness,
  Network,
  BellRing,
  Info,
  Check,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { createInvitation, fetchCrmAdmins } from '@/lib/usermanagement'
import { isValidIndianMobile, normalizeIndianPhone } from '@/lib/phone'

const roles = [
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

const permissions = [
  { label: 'Create Farmer Records', allowed: true },
  { label: 'Update Crop Life Cycle', allowed: true },
  { label: 'Access District Reports', allowed: true },
  { label: 'Delete Organization Data', allowed: false },
]

function needsCountry(level) {
  return ['country', 'state', 'district', 'ground'].includes(level)
}

function needsState(level) {
  return ['state', 'district', 'ground'].includes(level)
}

function needsDistrict(level) {
  return ['district', 'ground'].includes(level)
}

export default function InviteUserForm() {
  const navigate = useNavigate()
  const [activeRole, setActiveRole] = useState('district')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('IN')
  const [stateCode, setStateCode] = useState('MH')
  const [districtCode, setDistrictCode] = useState('PUNE')
  const [reportsToUserId, setReportsToUserId] = useState('')
  const [managers, setManagers] = useState([])
  const [sendEmail, setSendEmail] = useState(true)
  const [sendSms, setSendSms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchCrmAdmins()
      .then((res) => {
        if (active) setManagers(res?.admins || [])
      })
      .catch(() => {
        if (active) setManagers([])
      })
    return () => {
      active = false
    }
  }, [])

  const roleMeta = useMemo(
    () => roles.find((role) => role.level === activeRole) || roles[0],
    [activeRole]
  )

  const canSubmit =
    fullName.trim() &&
    phone.trim() &&
    (!sendEmail || email.trim())

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

        <div className="mt-8 flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-brand-primary" />
          <h2 className="text-[17px] font-semibold text-[#202939]">
            Select User Role
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {roles.map((role) => (
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

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
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

          {needsCountry(activeRole) ? (
            <div>
              <label className="mb-2 block text-[12px] font-medium text-[#374151]">
                Country Code
              </label>
              <input
                placeholder="e.g. IN"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
              />
            </div>
          ) : null}
        </div>

        {(needsState(activeRole) || needsDistrict(activeRole)) && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {needsState(activeRole) ? (
              <input
                placeholder="State Code (e.g. MH)"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
              />
            ) : null}
            {needsDistrict(activeRole) ? (
              <input
                placeholder="District Code (e.g. PUNE)"
                value={districtCode}
                onChange={(e) => setDistrictCode(e.target.value.toUpperCase())}
                className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
              />
            ) : null}
          </div>
        )}

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
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
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
            disabled={loading}
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
