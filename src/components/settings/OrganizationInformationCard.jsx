// OrganizationInformationCard.jsx

import { Building2 } from 'lucide-react'

export default function OrganizationInformationCard({ user }) {
  const organization = user?.organization || {}
  const orgName = organization?.organizationName || '—'
  const orgEmail = organization?.email || user?.email || '—'
  const orgPhone = organization?.phoneNumber || user?.phone || '—'

  const addressParts = [
    organization?.address,
    user?.village,
    user?.city,
    user?.state,
    user?.country,
  ].filter(Boolean)

  const orgAddress = addressParts.length > 0 ? addressParts.join(', ') : '—'

  return (
    <div className="rounded-[26px] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F1E6]">
          <Building2 className="h-4.5 w-4.5 text-brand-primary" />
        </div>

        <h2 className="text-[21px] font-semibold text-brand-primary">
          Organization Information
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
            Org Name
          </label>

          <input
            value={orgName}
            readOnly
            className="h-[52px] w-full rounded-2xl border border-[#CAD3CF] px-4 text-[15px] text-[#1F2937] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
            Support Email
          </label>

          <input
            value={orgEmail}
            readOnly
            className="h-[52px] w-full rounded-2xl border border-[#CAD3CF] px-4 text-[15px] text-[#1F2937] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
            Contact Number
          </label>

          <input
            value={orgPhone}
            readOnly
            className="h-[52px] w-full rounded-2xl border border-[#CAD3CF] px-4 text-[15px] text-[#1F2937] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
            Address
          </label>

          <textarea
            value={orgAddress}
            readOnly
            rows={2}
            className="w-full rounded-2xl border border-[#CAD3CF] px-4 py-3.5 text-[15px] text-[#1F2937] outline-none"
          />
        </div>
      </div>
    </div>
  )
}