import { MapPin, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

function formatLocation(user) {
  const parts = [user?.city, user?.state, user?.country].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
}

export default function ProfileHeader() {
  const { user, displayName, roleLabel } = useAuth()

  return (
    <div className="rounded-[28px] border border-[#E8ECEA] bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-[118px] w-[118px] rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="flex h-[118px] w-[118px] items-center justify-center rounded-full bg-brand-primary text-4xl font-semibold text-white shadow-md">
              {(displayName || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[44px] font-semibold tracking-[-1px] text-brand-primary">
                {displayName}
              </h1>
              <span className="rounded-full bg-brand-primary px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {roleLabel}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-7 text-[15px] text-[#4B5563]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {formatLocation(user)}
              </div>
              {user?.email ? (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              ) : null}
              {user?.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
