import { UserPlus, Clock3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UserManagementHeader({ pendingCount = 0 }) {
  const navigate = useNavigate()

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary lg:text-[26px]">
          Team members
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Invite and manage CRM admins by role and region.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {pendingCount > 0 ? (
          <button
            type="button"
            onClick={() => navigate('/pending-invitation')}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
          >
            <Clock3 className="h-4 w-4" />
            Pending
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold">
              {pendingCount}
            </span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => navigate('/invite-user')}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-950"
        >
          <UserPlus className="h-4 w-4" />
          Invite user
        </button>
      </div>
    </header>
  )
}
