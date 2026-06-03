import { useAuth } from '@/context/AuthContext'
import { UserAvatar } from '@/components/ui/EmptyState'

export default function PermissionUserSummary() {
  const { user, displayName, roleLabel } = useAuth()

  const details = [
    { label: 'EMAIL ADDRESS', value: user?.email || '—' },
    { label: 'PHONE', value: user?.phone || '—' },
    { label: 'ROLE', value: roleLabel || '—' },
    { label: 'USER ID', value: user?._id || '—' },
  ]

  return (
    <div className="mt-6 rounded-[22px] border border-[#E5E7EB] bg-white px-7 py-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div className="flex items-center gap-4 xl:border-r xl:border-[#E5E7EB] xl:pr-5">
          <UserAvatar name={displayName} avatar={user?.avatar} className="h-16 w-16 text-lg" />
          <div>
            <h3 className="text-[16px] font-semibold text-brand-primary">{displayName}</h3>
            <p className="mt-1 text-[13px] font-semibold text-brand-primary">{roleLabel}</p>
          </div>
        </div>

        {details.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">{item.label}</p>
            <p className="mt-2 break-all text-[15px] font-semibold text-brand-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
