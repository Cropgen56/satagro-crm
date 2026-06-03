import { useNavigate } from 'react-router-dom'
import { Clock3 } from 'lucide-react'

export default function PendingInvitationHeader({ count = 0 }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-brand-primary">
          Pending Invitations
        </h1>

        <p className="mt-1 max-w-[470px] text-sm leading-6 text-[#4B5563]">
          Users who have been invited but have not completed their first login via WhatsApp OTP.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
          <Clock3 className="h-4 w-4" />
          {count} pending
        </span>

        <button
          type="button"
          onClick={() => navigate('/user-management')}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
        >
          Back to users
        </button>
      </div>
    </div>
  )
}
