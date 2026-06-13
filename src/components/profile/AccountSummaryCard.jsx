import { ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

export default function AccountSummaryCard() {
  const { user, roleLabel } = useAuth()

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <h3 className="text-[18px] font-semibold text-brand-primary">Account Summary</h3>

      <div className="mt-7 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-[#6B7280]">Account Status</span>
          <span className="font-semibold text-[#059669]">● Active</span>
        </div>

        <div className="h-px bg-[#E5E7EB]" />

        <div className="flex items-center justify-between">
          <span className="text-[16px] text-[#6B7280]">Last Login</span>
          <span className="font-semibold text-[#111827]">
            {formatDate(user?.lastLoginAt)}
          </span>
        </div>

        <div className="h-px bg-[#E5E7EB]" />

        <div className="flex items-center justify-between">
          <span className="text-[16px] text-[#6B7280]">Member Since</span>
          <span className="font-semibold text-[#111827]">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : '—'}
          </span>
        </div>

        <div className="h-px bg-[#E5E7EB]" />

        <div className="flex items-center justify-between">
          <span className="text-[16px] text-[#6B7280]">Access Level</span>
          <span className="font-semibold text-brand-primary">{roleLabel || '—'}</span>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[#D8E1DD] bg-[#F7FAF8] p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-brand-primary" />
          <div>
            <h4 className="text-[16px] font-semibold text-brand-primary">Signed in</h4>
            <p className="mt-1 text-[14px] leading-6 text-[#6B7280]">
              You are authenticated with SatAgro CRM using your CropGen account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
