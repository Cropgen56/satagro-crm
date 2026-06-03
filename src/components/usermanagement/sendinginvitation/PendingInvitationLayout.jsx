import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PendingInvitationHeader from './PendingInvitationHeader'
import PendingInvitationFooter from './PendingInvitationFooter'
import { fetchPendingInvitations, resendInvitationEmail } from '@/lib/usermanagement'
import { UserAvatar } from '@/components/ui/EmptyState'
import EmptyState from '@/components/ui/EmptyState'

export default function PendingInvitationLayout() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resendingId, setResendingId] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const res = await fetchPendingInvitations()
        if (!active) return
        setUsers(res?.users || [])
      } catch (err) {
        if (!active) return
        setError(err.message || 'Failed to load pending invitations')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <PendingInvitationHeader count={users.length} />

      <div className="mt-8">
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

        {loading ? (
          <p className="text-sm text-gray-500">Loading pending invitations...</p>
        ) : users.length === 0 ? (
          <EmptyState
            title="No pending invitations"
            description="Users who have not completed login will appear here."
          />
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left hover:opacity-80"
                  onClick={() => navigate(`/user-management/${user.id}`)}
                >
                  <UserAvatar name={user.name} avatar={user.avatar} className="h-11 w-11" />
                  <div>
                    <p className="font-semibold text-brand-primary">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      {user.role} · {user.invitationEmail || user.email || user.phone}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    AWAITING VERIFY
                  </span>
                  <button
                    type="button"
                    disabled={resendingId === user.id}
                    onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        setResendingId(user.id)
                        await resendInvitationEmail(user.id)
                      } catch (err) {
                        setError(err.message || 'Resend failed')
                      } finally {
                        setResendingId(null)
                      }
                    }}
                    className="rounded-lg border border-brand-primary px-3 py-1.5 text-xs font-semibold text-brand-primary disabled:opacity-50"
                  >
                    {resendingId === user.id ? 'Sending...' : 'Resend email'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PendingInvitationFooter />
    </div>
  )
}
