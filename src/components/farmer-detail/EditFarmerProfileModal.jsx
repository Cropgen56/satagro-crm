import { useEffect, useState } from 'react'
import { AlertCircle, Loader2, X } from 'lucide-react'
import { createFarmer, updateFarmer } from '@/lib/farmers'
import { fetchCountries, fetchStates } from '@/lib/location'
import { normalizeIndianPhone } from '@/lib/phone'

const INPUT =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:bg-gray-50'

const LANGUAGES = [
  ['en', 'English'],
  ['hi', 'Hindi'],
  ['mr', 'Marathi'],
  ['gu', 'Gujarati'],
  ['kn', 'Kannada'],
  ['te', 'Telugu'],
  ['ta', 'Tamil'],
  ['ml', 'Malayalam'],
  ['bn', 'Bengali'],
  ['pa', 'Punjabi'],
  ['or', 'Odia'],
  ['as', 'Assamese'],
  ['ur', 'Urdu'],
]

function Field({ label, required, children, className }) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-medium text-gray-600">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

function toForm(farmer) {
  if (!farmer) {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      language: 'en',
      country: 'IN',
      state: '',
      district: '',
      city: '',
      village: '',
      pincode: '',
      clientId: '',
    }
  }
  const [first = '', ...rest] = String(farmer.name || '').split(' ')
  return {
    firstName: farmer.firstName ?? first,
    lastName: farmer.lastName ?? rest.join(' '),
    phone: farmer.phone && farmer.phone !== '—' ? farmer.phone : '',
    email: farmer.email || '',
    language: farmer.language || 'en',
    country: farmer.country || '',
    state: farmer.state || '',
    district: farmer.district || '',
    city: farmer.city || '',
    village: farmer.village || '',
    pincode: farmer.pincode || '',
  }
}

/** Code picker from the location API; falls back to a text box if it fails. */
function CodeSelect({ value, onChange, options, loading, failed, placeholder, maxLength, disabled }) {
  if (failed) {
    return (
      <input
        className={INPUT}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder={placeholder}
      />
    )
  }
  const known = options.some((o) => o.code === value)
  return (
    <select className={INPUT} value={value} disabled={disabled || loading} onChange={(e) => onChange(e.target.value)}>
      <option value="">{loading ? 'Loading…' : placeholder}</option>
      {value && !known ? <option value={value}>{value}</option> : null}
      {options.map((o) => (
        <option key={o.code} value={o.code}>
          {o.name}
        </option>
      ))}
    </select>
  )
}

/**
 * Edit an existing farmer's profile, or — with `farmer` null — add a new
 * farmer. `clients` (super admins) shows an optional client picker on add.
 */
export default function EditFarmerProfileModal({ farmer, clients = [], onSaved, onClose }) {
  const isNew = !farmer
  const [form, setForm] = useState(() => toForm(farmer))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [countries, setCountries] = useState({ list: [], loading: true, failed: false })
  const [states, setStates] = useState({ list: [], loading: false, failed: false })

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))
  const setInput = (key) => (e) => set(key)(e.target.value)

  useEffect(() => {
    fetchCountries()
      .then((list) => setCountries({ list, loading: false, failed: list.length === 0 }))
      .catch(() => setCountries({ list: [], loading: false, failed: true }))
  }, [])

  useEffect(() => {
    if (!form.country || countries.failed) {
      setStates({ list: [], loading: false, failed: countries.failed })
      return
    }
    let cancelled = false
    setStates((prev) => ({ ...prev, loading: true }))
    fetchStates(form.country)
      .then((list) => !cancelled && setStates({ list, loading: false, failed: list.length === 0 }))
      .catch(() => !cancelled && setStates({ list: [], loading: false, failed: true }))
    return () => {
      cancelled = true
    }
  }, [form.country, countries.failed])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !saving) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [saving, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.firstName.trim()) return setError('First name is required.')
    const phone = normalizeIndianPhone(form.phone)
    if (!phone) return setError('Enter a valid mobile number (10 digits, or with country code).')
    const email = form.email.trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError('Enter a valid email address.')
    }

    setSaving(true)
    try {
      const res = isNew
        ? await createFarmer({ ...form, phone, email, clientId: form.clientId || undefined })
        : await updateFarmer(farmer.id, { ...form, phone, email })
      onSaved(res?.farmer)
    } catch (err) {
      setError(err.message || 'Failed to save profile')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" onClick={saving ? undefined : onClose} />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-farmer-title"
        onSubmit={handleSubmit}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 pb-4 pt-6">
          <div>
            <h2 id="edit-farmer-title" className="text-lg font-semibold text-gray-900">
              {isNew ? 'Add farmer' : 'Edit profile'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isNew
                ? 'Register a farmer under BIODROPS. They can sign in with a WhatsApp or email OTP right away.'
                : `Update ${farmer.name}'s contact and location details.`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required>
                <input className={INPUT} value={form.firstName} maxLength={50} onChange={setInput('firstName')} disabled={saving} />
              </Field>
              <Field label="Last name">
                <input className={INPUT} value={form.lastName} maxLength={50} onChange={setInput('lastName')} disabled={saving} />
              </Field>
              <Field label="Mobile number" required>
                <input
                  className={INPUT}
                  type="tel"
                  value={form.phone}
                  onChange={setInput('phone')}
                  placeholder="+919876543210"
                  disabled={saving}
                />
              </Field>
              <Field label="Email">
                <input className={INPUT} type="email" value={form.email} onChange={setInput('email')} disabled={saving} />
              </Field>
              {isNew && clients.length ? (
                <Field label="Client (optional)">
                  <select className={INPUT} value={form.clientId} onChange={setInput('clientId')} disabled={saving}>
                    <option value="">BioDrops direct</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.organizationName} ({c.organizationCode})
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}
              <Field label="Language">
                <select className={INPUT} value={form.language} onChange={setInput('language')} disabled={saving}>
                  {LANGUAGES.some(([code]) => code === form.language) ? null : (
                    <option value={form.language}>{form.language}</option>
                  )}
                  {LANGUAGES.map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Location</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Country">
                <CodeSelect
                  value={form.country}
                  onChange={(code) => setForm((prev) => ({ ...prev, country: code, state: '' }))}
                  options={countries.list}
                  loading={countries.loading}
                  failed={countries.failed}
                  placeholder="Select country"
                  maxLength={3}
                  disabled={saving}
                />
              </Field>
              <Field label="State">
                <CodeSelect
                  value={form.state}
                  onChange={set('state')}
                  options={states.list}
                  loading={states.loading}
                  failed={states.failed}
                  placeholder={form.country ? 'Select state' : 'Select a country first'}
                  maxLength={10}
                  disabled={saving || (!form.country && !states.failed)}
                />
              </Field>
              <Field label="District">
                <input className={INPUT} value={form.district} maxLength={32} onChange={setInput('district')} disabled={saving} />
              </Field>
              <Field label="City">
                <input className={INPUT} value={form.city} maxLength={100} onChange={setInput('city')} disabled={saving} />
              </Field>
              <Field label="Village / area">
                <input className={INPUT} value={form.village} maxLength={100} onChange={setInput('village')} disabled={saving} />
              </Field>
              <Field label="Pincode">
                <input
                  className={INPUT}
                  inputMode="numeric"
                  value={form.pincode}
                  maxLength={10}
                  onChange={setInput('pincode')}
                  disabled={saving}
                />
              </Field>
            </div>
          </section>
        </div>

        {error ? (
          <div className="mx-6 mb-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : isNew ? (
              'Add farmer'
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
