import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Tractor, User, UserPlus } from 'lucide-react'
import FormSection from '@/components/add-farmer/FormSection'
import PageTopBar from '@/components/layout/PageTopBar'
import ConversionPreview from '@/components/leads/ConversionPreview'
import ConvertLeadSummary from '@/components/leads/ConvertLeadSummary'
import { Input, Label, Select, Textarea } from '@/components/leads/LeadFormField'
import { cropOptions, getConvertLeadData, irrigationTypes, subscriptionPlans } from '@/data/leads'

export default function ConvertLeadPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { summary, form: initialForm } = getConvertLeadData(id)
  const [form, setForm] = useState(initialForm)

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="min-h-full pb-24">
      <div className="p-6 lg:p-8">
        <PageTopBar />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Convert to Farmer</h1>
            <p className="mt-1 text-sm text-gray-500">Complete farmer onboarding using lead information</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => navigate(`/leads/${id}`)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="mt-8">
          <ConvertLeadSummary summary={summary} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
              <FormSection icon={User} title="Pre-filled Personal Information">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      badge="IMPORTED"
                    />
                  </div>
                  <div>
                    <Label>Mobile Number</Label>
                    <Input
                      value={form.mobile}
                      onChange={(e) => update('mobile', e.target.value)}
                      badge="IMPORTED"
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={form.state} badge="IMPORTED" readOnly />
                  </div>
                  <div>
                    <Label>District</Label>
                    <Input value={form.district} badge="IMPORTED" readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Village</Label>
                    <Input
                      placeholder="Enter village"
                      value={form.village}
                      onChange={(e) => update('village', e.target.value)}
                    />
                  </div>
                </div>
              </FormSection>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
              <FormSection icon={Tractor} title="Additional Farmer Information">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label>Land Size (Acres)</Label>
                    <Input
                      placeholder="e.g. 12"
                      value={form.landSize}
                      onChange={(e) => update('landSize', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Irrigation Type</Label>
                    <Select value={form.irrigation} onChange={(e) => update('irrigation', e.target.value)}>
                      <option value="">Select type</option>
                      {irrigationTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label>Primary Crop</Label>
                    <Select value={form.primaryCrop} onChange={(e) => update('primaryCrop', e.target.value)}>
                      <option value="">Select crop</option>
                      {cropOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label>Subscription Plan</Label>
                    <Select
                      value={form.subscriptionPlan}
                      onChange={(e) => update('subscriptionPlan', e.target.value)}
                    >
                      {subscriptionPlans.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </FormSection>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
              <FormSection icon={ClipboardList} title="Assignment & Notes">
                <div className="space-y-6">
                  <div>
                    <Label>Assigned Relationship Manager</Label>
                    <Input value={form.assignedAgent} readOnly />
                  </div>
                  <div>
                    <Label>Operational Notes</Label>
                    <Textarea
                      placeholder="Add any operational notes for the field team..."
                      value={form.operationalNotes}
                      onChange={(e) => update('operationalNotes', e.target.value)}
                    />
                  </div>
                </div>
              </FormSection>
            </div>
          </div>

          <ConversionPreview />
        </div>
      </div>

      <footer className="fixed bottom-0 left-[260px] right-0 z-10 border-t border-gray-200 bg-white px-6 py-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(`/leads/${id}`)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lead Details
          </button>
          <button
            type="button"
            onClick={() => navigate('/farmers')}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
          >
            <UserPlus className="h-4 w-4" />
            Convert & Create Farmer
          </button>
        </div>
      </footer>
    </div>
  )
}
