import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { hierarchyLevelLabel } from '@/lib/adminHierarchy'

export default function InviteUserHeader() {
  const navigate = useNavigate()
  const { roleLabel, hierarchy } = useAuth()
  const creatable = hierarchy?.creatableLevels || []

  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
          Invite User
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and invite a new CRM user to your organization.
        </p>
        {roleLabel && creatable.length ? (
          <p className="mt-2 text-xs text-brand-primary">
            Signed in as {roleLabel}. You can invite:{' '}
            {creatable.map(hierarchyLevelLabel).join(', ')}.
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/user-management')}
          className="rounded-xl border border-[#BFC8C5] bg-white px-5 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#F5F7F6]"
        >
          Back
        </button>

        <button className="rounded-xl border border-[#BFC8C5] bg-white px-5 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#F5F7F6]">
          Save Draft
        </button>
      </div>
    </header>
  )
}