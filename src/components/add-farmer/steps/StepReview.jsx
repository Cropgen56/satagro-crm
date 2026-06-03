import { Pencil } from 'lucide-react'
import { cropOptions, fieldAgents, subscriptionPlans } from '@/lib/moduleConstants'

function ReviewCard({ title, onEdit, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-primary"
          aria-label={`Edit ${title}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, badge }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      {badge ? (
        <span className="mt-0.5 inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
          {value}
        </span>
      ) : (
        <p className="mt-0.5 text-sm font-medium text-gray-900">{value || '—'}</p>
      )}
    </div>
  )
}

export default function StepReview({ form, updateForm, goToStep }) {
  const primaryCrop = cropOptions.find((c) => c.id === form.primaryCrop)
  const agent = fieldAgents.find((a) => a.id === form.assignedAgent)
  const plan = subscriptionPlans.find((p) => p.id === form.plan)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review and confirm farmer details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please verify all information before saving the farmer record to the registry.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReviewCard title="Personal Details" onEdit={() => goToStep(1)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" value={form.fullName} />
            <Field label="Mobile" value={form.mobile ? `+91 ${form.mobile}` : ''} />
            <Field label="Gender" value={form.gender} />
            <Field label="Date of Birth" value={form.dob} />
          </div>
        </ReviewCard>

        <ReviewCard title="Location & Land" onEdit={() => goToStep(2)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="State / District" value={`${form.state} / ${form.district}`} />
            <Field label="Village" value={form.village} />
            <Field
              label="Land Size"
              value={
                form.landSize
                  ? `${form.landSize} ${form.landUnit === 'hectares' ? 'Hectares' : 'Acres'}`
                  : ''
              }
            />
            <Field label="Irrigation" value={form.irrigation} />
          </div>
        </ReviewCard>

        <ReviewCard title="Crop Details" onEdit={() => goToStep(3)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Crop" value={primaryCrop?.label} />
            <Field label="Secondary Crop" value={(form.secondaryCrops || []).join(', ')} />
            <Field label="Season" value={form.season} badge />
            <Field label="Current Stage" value={form.cropStage} />
          </div>
        </ReviewCard>

        <ReviewCard title="Subscription & Agent" onEdit={() => goToStep(4)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Assigned Agent" value={agent?.name} />
            <Field label="Plan" value={plan ? `${plan.name} (12M)` : ''} />
            <Field label="Status" value="Pending Payment" />
          </div>
          {form.internalNotes && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-500">Internal Notes</p>
              <p className="mt-1 text-sm text-gray-600">{form.internalNotes}</p>
            </div>
          )}
        </ReviewCard>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-white p-4">
        <input
          type="checkbox"
          checked={form.confirmed}
          onChange={(e) => updateForm('confirmed', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
        />
        <span className="text-sm text-gray-600">
          I confirm that all information provided is accurate and complete to the best of my
          knowledge.
        </span>
      </label>
    </div>
  )
}
