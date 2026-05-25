// components/usermanagement/pendinginvitation/PendingInvitationFooter.jsx

import { Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PendingInvitationFooter() {
  const navigate = useNavigate()

  return (
    <div className="mt-12 flex items-center justify-end gap-20 border-t border-[#E5E7EB] pt-8">
      <button
        onClick={() => navigate('/user-management')}
        className="text-[14px] font-semibold text-[#374151]"
      >
        Back to User Management
      </button>

      <button className="inline-flex h-12 items-center gap-3 rounded-full bg-brand-primary px-8 text-[14px] font-semibold text-white shadow-lg shadow-emerald-900/20">
        <Send className="h-4 w-4" />
        Resend Invitation
      </button>
    </div>
  )
}