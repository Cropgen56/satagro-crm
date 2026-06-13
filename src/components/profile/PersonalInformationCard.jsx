import { User, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const fieldClass =
  'h-[56px] w-full rounded-2xl border border-[#CAD3CF] bg-gray-50 px-4 text-[16px] text-[#1F2937] outline-none'

export default function PersonalInformationCard() {
  const { user, displayName } = useAuth()

  const orgName =
    user?.organization?.organizationName ||
    user?.organization?.organizationCode ||
    '—'

  return (
    <div className="rounded-[30px] bg-white p-8 shadow-sm">
      <div>
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-brand-primary" />
          <h3 className="text-[18px] font-semibold text-brand-primary">Basic Information</h3>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              Full Name
            </label>
            <input value={displayName} readOnly className={fieldClass} />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              Email Address
            </label>
            <input value={user?.email || '—'} readOnly className={fieldClass} />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              Mobile Number
            </label>
            <input value={user?.phone || '—'} readOnly className={fieldClass} />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
              User ID
            </label>
            <input value={user?._id || '—'} readOnly className={fieldClass} />
          </div>
        </div>
      </div>

      <div className="my-10 h-px bg-[#E5E7EB]" />

      <div>
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-brand-primary" />
          <h3 className="text-[18px] font-semibold text-brand-primary">
            Organization
          </h3>
        </div>

        <div className="mt-7">
          <label className="mb-2 block text-[14px] font-semibold text-brand-primary">
            Organization
          </label>
          <input value={orgName} readOnly className={fieldClass} />
        </div>
      </div>
    </div>
  )
}
