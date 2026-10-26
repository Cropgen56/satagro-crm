import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import { assignFarmerClient, fetchClients } from '@/lib/clients'

/** Admin control: attach this farmer to a BioDrops client, or detach them. */
export default function FarmerClientCard({ farmer, onChange }) {
  const [clients, setClients] = useState([])
  const [selected, setSelected] = useState(farmer.client?.id || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchClients()
      .then((res) => setClients(res?.clients || []))
      .catch(() => setClients([]))
  }, [])

  useEffect(() => {
    setSelected(farmer.client?.id || '')
  }, [farmer.client?.id])

  const current = farmer.client?.id || ''
  const assignable = clients.filter((c) => c.status === 'active' || c.id === current)

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      const res = await assignFarmerClient(farmer.id, selected || null)
      const client = res?.client
        ? {
            id: res.client.id,
            name: res.client.organizationName,
            code: res.client.organizationCode,
          }
        : null
      onChange?.(client)
      setMessage({
        type: 'success',
        text: client ? `Assigned to ${client.name}.` : 'Removed from client.',
      })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update client.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7EFEC]">
          <Building2 className="h-5 w-5 text-brand-primary" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900">Client organization</p>
          <p className="mt-0.5 text-sm text-gray-500">
            {farmer.client?.name
              ? `${farmer.client.name}${farmer.client.code ? ` · ${farmer.client.code}` : ''}`
              : 'Direct BioDrops farmer — not under any client.'}
          </p>
          {message ? (
            <p
              className={
                message.type === 'error'
                  ? 'mt-1 text-xs text-red-600'
                  : 'mt-1 text-xs text-green-700'
              }
            >
              {message.text}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          aria-label="Client organization"
          className="h-10 min-w-[220px] rounded-lg border border-gray-200 bg-gray-50/80 px-3 text-sm text-gray-700 outline-none focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
        >
          <option value="">No client (BioDrops direct)</option>
          {assignable.map((client) => (
            <option key={client.id} value={client.id}>
              {client.organizationName} ({client.organizationCode})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || selected === current}
          className="h-10 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
