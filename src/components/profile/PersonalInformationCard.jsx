// PersonalInformationCard.jsx

import {
  User,
  Building2,
  Globe,
  ChevronDown,
} from 'lucide-react'

export default function PersonalInformationCard() {
  return (
    <div className="rounded-[30px] bg-white p-8 shadow-sm">
      <div>
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-brand-primary" />

          <h3 className="text-[18px] font-semibold text-brand-primary">
            Basic Information
          </h3>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              Full Name
            </label>

            <input
              value="Marcus Green"
              readOnly
              className="h-[56px] w-full rounded-2xl border border-[#CAD3CF] bg-white px-4 text-[16px] text-[#1F2937] outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              Email Address
            </label>

            <input
              value="m.green@agricrm-ent.com"
              readOnly
              className="h-[56px] w-full rounded-2xl border border-[#CAD3CF] bg-white px-4 text-[16px] text-[#1F2937] outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              Mobile Number
            </label>

            <input
              value="+91 98765 43210"
              readOnly
              className="h-[56px] w-full rounded-2xl border border-[#CAD3CF] bg-white px-4 text-[16px] text-[#1F2937] outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              Employee ID
            </label>

            <input
              value="AG-ENT-2024-089"
              readOnly
              className="h-[56px] w-full rounded-2xl border border-[#CAD3CF] bg-white px-4 text-[16px] text-[#1F2937] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="my-10 h-px bg-[#E5E7EB]" />

      <div>
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-brand-primary" />

          <h3 className="text-[18px] font-semibold text-brand-primary">
            Organization Assignment
          </h3>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-[#F7F8F7] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7A7A7A]">
              User Role
            </p>

            <h4 className="mt-3 text-[16px] font-bold text-[#1F2937]">
              Regional Admin
            </h4>
          </div>

          <div className="rounded-2xl bg-[#F7F8F7] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7A7A7A]">
              Country
            </p>

            <h4 className="mt-3 text-[16px] font-bold text-[#1F2937]">
              India
            </h4>
          </div>

          <div className="rounded-2xl bg-[#F7F8F7] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7A7A7A]">
              State
            </p>

            <h4 className="mt-3 text-[16px] font-bold text-[#1F2937]">
              Maharashtra
            </h4>
          </div>

          <div className="rounded-2xl bg-[#F7F8F7] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7A7A7A]">
              District
            </p>

            <h4 className="mt-3 text-[16px] font-bold text-[#1F2937]">
              Pune Region
            </h4>
          </div>
        </div>

        <p className="mt-6 text-[14px] text-[#7A7A7A]">
          ⓘ Contact Global HR to update organization assignments.
        </p>
      </div>

      <div className="my-10 h-px bg-[#E5E7EB]" />

      <div>
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-brand-primary" />

          <h3 className="text-[18px] font-semibold text-brand-primary">
            Regional Preferences
          </h3>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-[#4B5563]">
              Preferred Language
            </label>

            <div className="flex h-[56px] items-center justify-between rounded-2xl border border-[#CAD3CF] px-4">
              <span className="text-[16px] text-[#1F2937]">
                English (United Kingdom)
              </span>

              <ChevronDown className="h-5 w-5 text-[#7A7A7A]" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-[#4B5563]">
              Timezone
            </label>

            <div className="flex h-[56px] items-center justify-between rounded-2xl border border-[#CAD3CF] px-4">
              <span className="text-[16px] text-[#1F2937]">
                (GMT+05:30) Mumbai, Kolkata, New Delhi
              </span>

              <ChevronDown className="h-5 w-5 text-[#7A7A7A]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-end gap-4">
        <button className="rounded-2xl border border-[#CAD3CF] bg-white px-8 py-4 text-[16px] font-semibold text-[#1F2937]">
          Discard Changes
        </button>

        <button className="rounded-2xl bg-brand-primary px-10 py-4 text-[16px] font-semibold text-white shadow-sm">
          Save Settings
        </button>
      </div>
    </div>
  )
}