import { useAuth } from '@/hooks/useAuth'
import { UserAvatar } from '@/components/ui/EmptyState'

export default function RegionAssignSidebar() {
  const { displayName, roleLabel } = useAuth()

  return (
    <aside className="rounded-[22px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <UserAvatar name={displayName} className="h-14 w-14 text-lg" />
        <div>
          <p className="text-[15px] font-semibold text-brand-primary">{displayName}</p>
          <p className="text-[12px] text-[#6B7280]">{roleLabel}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-gray-500">
        Region assignment controls which territories this admin can manage. Map and
        hierarchy data will load from the API when available.
      </p>
    </aside>
  )
}
