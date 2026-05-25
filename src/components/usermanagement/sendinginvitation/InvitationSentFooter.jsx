// components/usermanagement/sendinginvitation/InvitationSentFooter.jsx

import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function InvitationSentFooter() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between border-t border-[#EEF2F0] px-7 py-6">
      <div className="flex items-start gap-3">
        <Shield className="mt-1 h-5 w-5 text-brand-primary" />

        <p className="max-w-[460px] text-[13px] leading-6 text-[#6B7280]">
          Security Note: Invitation link expires in 48 hours. Account will remain inactive until registration is complete.
        </p>
      </div>

      <div className="flex items-center gap-7">
        <button
          onClick={() => navigate('/pending-invitation')}
          className="text-[15px] font-semibold text-brand-primary"
        >
          Go to Pending Invitations
        </button>

        <button
          onClick={() => navigate('/invite-user')}
          className="h-12 rounded-2xl bg-brand-primary px-8 text-[15px] font-semibold text-white shadow-lg shadow-emerald-900/20"
        >
          Invite Another User
        </button>
      </div>
    </div>
  )
}