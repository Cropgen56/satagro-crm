import { useNavigate } from 'react-router-dom'

export default function RoleAssignHeader() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-[22px] font-bold text-brand-primary">
          Assign Role & Hierarchy
        </h1>

        <p className="mt-1 text-[13px] text-[#6B7280]">
          Define user authority level and organizational structure
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/invite-user')}
          className="rounded-xl border border-[#CBD5D1] bg-white px-5 py-2.5 text-[13px] font-medium text-[#374151]"
        >
          Back
        </button>

        <button className="rounded-xl border border-[#CBD5D1] bg-white px-5 py-2.5 text-[13px] font-medium text-[#374151]">
          Save Draft
        </button>
      </div>
    </div>
  )
}