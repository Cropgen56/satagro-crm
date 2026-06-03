import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  updateCrmUser,
  fetchCrmAdmins,
  fetchUserById,
} from '@/lib/usermanagement'
import { isValidIndianMobile, normalizeIndianPhone } from '@/lib/phone'

const roles = [
  { title: 'Super Admin', level: 'super' },
  { title: 'Country Admin', level: 'country' },
  { title: 'State User', level: 'state' },
  { title: 'District Operator', level: 'district' },
  { title: 'FPO / Agent', level: 'ground' },
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

export default function EditUserForm({ userId }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [managers, setManagers] = useState([])

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [activeRole, setActiveRole] = useState('district')
  const [countryCode, setCountryCode] = useState('IN')
  const [stateCode, setStateCode] = useState('')
  const [districtCode, setDistrictCode] = useState('')
  const [reportsToUserId, setReportsToUserId] = useState('')
  const [assignmentStatus, setAssignmentStatus] = useState('active')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const [userRes, adminsRes] = await Promise.all([
          fetchUserById(userId),
          fetchCrmAdmins(),
        ])
        if (!active) return

        const user = userRes?.user
        const assignmentList = userRes?.assignments || []
        const primary =
          assignmentList.find((a) => a.status === 'active') ||
          assignmentList[0]

        setFullName(user?.name || '')
        setEmail(user?.email || '')
        setPhone(user?.phone?.replace(/^\+91/, '') || user?.phone || '')
        setActiveRole(user?.adminLevel || primary?.level || 'district')
        setCountryCode(primary?.countryCode || user?.country || 'IN')
        setStateCode(primary?.stateCode || user?.state || '')
        setDistrictCode(primary?.districtCode || user?.district || '')
        setReportsToUserId(primary?.appointedBy?.id || user?.reportsToId || '')
        setAssignmentStatus(
          user?.assignmentStatus === 'suspended' ? 'suspended' : 'active'
        )

        setManagers(
          (adminsRes?.admins || []).filter((a) => a.id !== userId)
        )
      } catch (err) {
        if (active) setError(err.message || 'Failed to load user')
      } finally {
        if (active) setLoading(false)
      }
    }
    if (userId) load()
    return () => {
      active = false
    }
  }, [userId])

  const roleMeta = useMemo(
    () => roles.find((r) => r.level === activeRole) || roles[0],
    [activeRole]
  )

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

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-[#E3E8E6] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-primary">Edit user</h2>
      <p className="mt-1 text-sm text-gray-500">
        Update profile, role, region scope, and access for {roleMeta.title}.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Full name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
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
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Mobile (+91)
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
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

      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-gray-600">
          Role
        </label>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role.level}
              type="button"
              onClick={() => setActiveRole(role.level)}
              className={clsx(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                activeRole === role.level
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {role.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Reports to
          </label>
          <select
            value={reportsToUserId}
            onChange={(e) => setReportsToUserId(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
          >
            <option value="">None</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.role}
              </option>
            ))}
          </select>
        </div>
        {needsCountry(activeRole) ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Country code
            </label>
            <input
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
            />
          </div>
        ) : null}
        {needsState(activeRole) ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              State code
            </label>
            <input
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value.toUpperCase())}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
            />
          </div>
        ) : null}
        {needsDistrict(activeRole) ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              District code
            </label>
            <input
              value={districtCode}
              onChange={(e) => setDistrictCode(e.target.value.toUpperCase())}
              className="h-11 w-full rounded-xl border border-[#CBD5D1] px-4 text-sm outline-none focus:border-brand-primary"
            />
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
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
