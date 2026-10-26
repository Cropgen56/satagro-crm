// ClientOrganizationCard.jsx

import { useState } from 'react'
import { Building2, Check, Copy } from 'lucide-react'

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium uppercase text-[#5B5B5B]">
        {label}
      </label>

      <input
        value={value || '—'}
        readOnly
        className="h-[52px] w-full rounded-2xl border border-[#CAD3CF] px-4 text-[15px] text-[#1F2937] outline-none"
      />
    </div>
  )
}

/** A client login's own organization, with the code its farmers sign up with. */
export default function ClientOrganizationCard({ organization }) {
  const [copied, setCopied] = useState(false)
  const code = organization?.organizationCode || ''

  const copyCode = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked: the code is still visible to copy by hand.
    }
  }

  const address = organization?.address || {}
  const addressText =
    [address.city, address.state, address.country, address.pincode].filter(Boolean).join(', ') ||
    '—'

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

      <div className="mt-8 rounded-2xl border border-[#D8E1DD] bg-[#F7FAF8] p-5">
        <p className="text-[13px] font-medium uppercase text-[#5B5B5B]">Organization code</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[26px] font-semibold tracking-wider text-brand-primary">
            {code || '—'}
          </span>

          {code ? (
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C9D3CF] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#2B2B2B] transition hover:bg-gray-50"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          ) : null}
        </div>

        <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">
          Share this code with your farmers. When they enter it while signing up on the BioDrops
          app, they are registered under your organization and appear in your Farmers list.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ReadOnlyField label="Org Name" value={organization?.organizationName} />
        <ReadOnlyField label="Email" value={organization?.email} />
        <ReadOnlyField label="Contact Number" value={organization?.phoneNumber} />
        <ReadOnlyField label="Address" value={addressText} />
      </div>
    </div>
  )
}
