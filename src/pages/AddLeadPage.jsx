import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlignLeft, BarChart3, MapPin, Phone, User, UserPlus } from 'lucide-react'
import FormSection from '@/components/add-farmer/FormSection'
import PageTopBar from '@/components/layout/PageTopBar'
import { Input, Label, Select, Textarea } from '@/components/leads/LeadFormField'
import { agents, districts, initialLeadForm, leadSources, leadStatuses, states, villages } from '@/data/leads'

export default function AddLeadPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialLeadForm)

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const districtOptions = districts[form.state] || []
  const villageOptions = villages[form.district] || []

  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Add Lead</h1>
          <p className="mt-1 text-sm text-gray-500">Create a new lead entry in the Maharashtra cluster.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Save Draft
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
        <div className="space-y-10">
          <FormSection icon={User} title="Basic Information">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="e.g. Rahul Sharma"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="00000 00000"
                    value={form.mobile}
                    onChange={(e) => update('mobile', e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label>Alternate Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="00000 00000"
                    value={form.altPhone}
                    onChange={(e) => update('altPhone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon={MapPin} title="Location Details">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label>State</Label>
                <Select value={form.state} onChange={(e) => update('state', e.target.value)}>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>District</Label>
                <Select value={form.district} onChange={(e) => update('district', e.target.value)}>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Village</Label>
                <Select value={form.village} onChange={(e) => update('village', e.target.value)}>
                  <option value="">Select village</option>
                  {villageOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </FormSection>

          <div className="grid gap-8 lg:grid-cols-2">
            <FormSection icon={BarChart3} title="Source & Status">
              <div className="space-y-6">
                <div>
                  <Label>Lead Source</Label>
                  <Select value={form.source} onChange={(e) => update('source', e.target.value)}>
                    {leadSources.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Lead Status</Label>
                  <Select value={form.status} onChange={(e) => update('status', e.target.value)}>
                    {leadStatuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </FormSection>

            <FormSection icon={UserPlus} title="Assignment">
              <div>
                <Label>Assigned Agent</Label>
                <Select value={form.assignedAgent} onChange={(e) => update('assignedAgent', e.target.value)}>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </Select>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <img
                    src={agents.find((a) => a.id === form.assignedAgent)?.avatar}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {agents.find((a) => a.id === form.assignedAgent)?.name}
                  </span>
                </div>
              </div>
            </FormSection>
          </div>

          <FormSection icon={AlignLeft} title="Additional Notes">
            <Textarea
              placeholder="Write any additional remarks here..."
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </FormSection>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-lg border-2 border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary hover:bg-brand-light"
        >
          Save & Add Another
        </button>
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
        >
          Save Lead
        </button>
      </div>
    </div>
  )
}
