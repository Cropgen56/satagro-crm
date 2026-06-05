import { Calendar, Phone, User } from 'lucide-react'
import FormSection from '../FormSection'

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'

export default function StepPersonal({ form, updateForm }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide the primary contact information for the farmer.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => updateForm('fullName', e.target.value)}
            placeholder="e.g. Johnathan Smith"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Mobile Number</label>
          <div className="flex overflow-hidden rounded-lg border border-gray-200 focus-within:ring-1 focus-within:ring-brand-primary">
            <div className="flex items-center gap-1 border-r border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
              <span>+91</span>
            </div>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => updateForm('mobile', e.target.value)}
                placeholder="98765 43210"
                className="w-full py-2.5 pl-10 pr-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Alternate Number <span className="font-normal text-gray-400">(Optional)</span>
          </label>
          <input
            type="tel"
            value={form.altPhone}
            onChange={(e) => updateForm('altPhone', e.target.value)}
            placeholder="Alternate phone"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => updateForm('gender', e.target.value)}
            className={inputClass}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="relative">
            <input
              type="date"
              value={form.dob}
              onChange={(e) => updateForm('dob', e.target.value)}
              className={inputClass}
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
        <div className="flex gap-3">
          <User className="h-5 w-5 shrink-0 text-brand-primary" />
          <div>
            <p className="text-sm font-semibold text-brand-primary">Why we need this?</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              Personal details help in creating a unique Farmer ID for compliance and record-keeping
              management. Ensure the mobile number is active for SMS notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
