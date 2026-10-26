// components/usermanagement/pendinginvitation/PendingInvitationFooter.jsx

import { useNavigate } from 'react-router-dom'

export default function PendingInvitationFooter() {
  const navigate = useNavigate()

  return (
    <div className="mt-12 flex items-center justify-end border-t border-[#E5E7EB] pt-8">
      <button
        onClick={() => navigate('/user-management')}
        className="text-[14px] font-semibold text-[#374151]"
      >
        Back to User Management
      </button>
    </div>
  )
}
