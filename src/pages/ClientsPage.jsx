import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import clsx from 'clsx'
import { Building2, Check, Copy, Plus, X } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { createClient, fetchClients, updateClient } from '@/lib/clients'
import { useAuth } from '@/hooks/useAuth'

const INPUT =
  'h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 px-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15'

const EMPTY_FORM = {
  organizationName: '',
  contactName: '',
  email: '',
  phoneNumber: '',
  organizationCode: '',
  city: '',
  state: '',
  sendWelcomeEmail: true,
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-xs text-gray-400">{hint}</span> : null}
    </label>
  )
}

function CopyCode({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (insecure context) — the code is still visible.
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#E7EFEC] px-2 py-1 font-mono text-xs font-semibold text-brand-primary hover:bg-[#d8e6e0]"
      title="Copy organization code"
    >
      {code}
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

function CreateClientForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      const res = await createClient({
        organizationName: form.organizationName,
        contactName: form.contactName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        organizationCode: form.organizationCode || undefined,
        address: { city: form.city, state: form.state, country: 'IN' },
        sendWelcomeEmail: form.sendWelcomeEmail,
      })
      onCreated?.(res)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message || 'Failed to create client')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">New client</h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Organization name *">
          <input
            required
            className={INPUT}
            value={form.organizationName}
            onChange={set('organizationName')}
          />
        </Field>
        <Field label="Contact person">
          <input className={INPUT} value={form.contactName} onChange={set('contactName')} />
        </Field>
        <Field label="Login email *" hint="The client signs in to this CRM with an OTP sent here.">
          <input
            required
            type="email"
            className={INPUT}
            value={form.email}
            onChange={set('email')}
          />
        </Field>
        <Field label="Phone">
          <input className={INPUT} value={form.phoneNumber} onChange={set('phoneNumber')} />
        </Field>
        <Field
          label="Organization code"
          hint="Farmers enter this at signup. Leave blank to auto-generate (e.g. BD-7K3Q9X). Cannot be changed later."
        >
          <input
            className={clsx(INPUT, 'font-mono uppercase')}
            value={form.organizationCode}
            onChange={set('organizationCode')}
            maxLength={24}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City">
            <input className={INPUT} value={form.city} onChange={set('city')} />
          </Field>
          <Field label="State">
            <input className={INPUT} value={form.state} onChange={set('state')} />
          </Field>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.sendWelcomeEmail}
          onChange={set('sendWelcomeEmail')}
          className="h-4 w-4 rounded border-gray-300 text-brand-primary"
        />
        Email the client sign-in instructions
      </label>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-10 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-60"
        >
          {saving ? 'Creating…' : 'Create client'}
        </button>
      </div>
    </form>
  )
}

export default function ClientsPage() {
  const { canManageClients } = useAuth()
  if (!canManageClients) return <Navigate to="/dashboard" replace />
  return <ClientsManager />
}

function ClientsManager() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetchClients()
      setClients(res?.clients || [])
    } catch (err) {
      setError(err.message || 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCreated = (res) => {
    setShowForm(false)
    const c = res?.client
    if (c) {
      setClients((prev) => [c, ...prev])
      setNotice(
        `${c.organizationName} created with code ${c.organizationCode}.` +
          (res.welcomeEmailSent ? ' Sign-in instructions were emailed.' : ''),
      )
    }
  }

  const toggleStatus = async (client) => {
    const next = client.status === 'active' ? 'inactive' : 'active'
    if (
      next === 'inactive' &&
      !window.confirm(
        `Deactivate ${client.organizationName}? Their login stops working and the code can no longer be used to sign up. Existing farmers stay linked.`,
      )
    ) {
      return
    }
    try {
      setBusyId(client.id)
      const res = await updateClient(client.id, { status: next })
      setClients((prev) => prev.map((c) => (c.id === client.id ? res.client : c)))
    } catch (err) {
      setError(err.message || 'Failed to update client')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[26px]">
              Clients
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Partner organizations under BioDrops. Farmers who sign up with a client's code are
              visible to that client in this CRM.
            </p>
          </div>
          {!showForm ? (
            <button
              type="button"
              onClick={() => {
                setNotice('')
                setShowForm(true)
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
            >
              <Plus className="h-4 w-4" />
              Add client
            </button>
          ) : null}
        </header>

        {notice ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {notice}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {showForm ? (
          <CreateClientForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
        ) : null}

        {!loading && clients.length === 0 && !error ? (
          <EmptyState
            icon={Building2}
            title="No clients yet"
            description="Add a client to give them an organization code for their farmers."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {['Organization', 'Code', 'Login', 'Farmers', 'Status', ''].map((col) => (
                      <th key={col || 'actions'} className="px-5 py-3.5">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-500">
                        Loading clients…
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50/60">
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {client.organizationName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {[client.address?.city, client.address?.state]
                              .filter(Boolean)
                              .join(', ') ||
                              client.phoneNumber ||
                              '—'}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <CopyCode code={client.organizationCode} />
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {client.logins?.[0]?.email || client.email || '—'}
                          <span className="block text-xs text-gray-400">
                            {client.logins?.[0]?.lastLoginAt
                              ? `Last login ${new Date(client.logins[0].lastLoginAt).toLocaleDateString('en-IN')}`
                              : 'Never signed in'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                          {client.farmerCount}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                              client.status === 'active'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-500',
                            )}
                          >
                            <span
                              className={clsx(
                                'h-1.5 w-1.5 rounded-full',
                                client.status === 'active' ? 'bg-green-500' : 'bg-gray-400',
                              )}
                            />
                            {client.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={busyId === client.id}
                            onClick={() => toggleStatus(client)}
                            className={clsx(
                              'rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50',
                              client.status === 'active'
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-brand-primary hover:bg-[#E7EFEC]',
                            )}
                          >
                            {client.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
