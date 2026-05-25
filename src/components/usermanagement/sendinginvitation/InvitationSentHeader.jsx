// components/usermanagement/sendinginvitation/InvitationSentHeader.jsx

import { Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function InvitationSentHeader() {
  const navigate = useNavigate()

  return (
    <div className="flex items-start justify-between p-7">
      <div>
        <h1 className="text-[30px] font-bold text-brand-primary">
          Invitation Sent
        </h1>

        <p className="mt-1 text-[15px] text-[#6B7280]">
          User invitation has been successfully created and dispatched
        </p>
      </div>

      <button
        onClick={() => navigate('/user-management')}
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#CBD5D1] px-6 text-[15px] font-semibold text-brand-primary"
      >
        <Users className="h-4 w-4" />
        View User Management
      </button>
    </div>
  )
}