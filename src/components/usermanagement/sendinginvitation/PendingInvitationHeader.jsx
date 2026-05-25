// components/usermanagement/pendinginvitation/PendingInvitationHeader.jsx

import { Send } from 'lucide-react'

export default function PendingInvitationHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-brand-primary">
          Pending Invitation
        </h1>

        <p className="mt-1 max-w-[470px] text-sm leading-6 text-[#4B5563]">
          Monitor onboarding progress and invitation activity for potential team members.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-14 rounded-full border border-[#9CA7A3] px-9 text-sm font-semibold text-brand-primary">
          Cancel
          <br />
          Invitation
        </button>

        <button className="inline-flex h-14 items-center gap-3 rounded-full bg-brand-primary px-9 text-sm font-semibold text-white shadow-sm">
          <Send className="h-4 w-4" />
          Resend
          <br />
          Invitation
        </button>
      </div>
    </div>
  )
}