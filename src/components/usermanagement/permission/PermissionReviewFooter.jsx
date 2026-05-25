// components/usermanagement/permission/PermissionReviewFooter.jsx

import { useNavigate } from 'react-router-dom'

export default function PermissionReviewFooter() {
  const navigate = useNavigate()

  return (
    <div className="mt-7 flex items-center justify-between border-t border-[#E5E7EB] pt-7">
      <label className="flex items-center gap-4">
        <input
          type="checkbox"
          className="h-6 w-6 rounded border-[#CBD5D1]"
        />

        <span className="max-w-[360px] text-[15px] font-medium leading-6 text-brand-primary">
          I confirm the assigned permissions and region access are correct.
        </span>
      </label>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/region-assignment')}
          className="h-12 rounded-2xl border border-[#B8C2BE] px-8 text-[15px] font-semibold text-[#6B7280]"
        >
          Back
        </button>

        <button className="h-12 rounded-2xl border border-[#B8C2BE] px-8 text-[15px] font-semibold text-[#6B7280]">
          Save as Draft
        </button>

        <button
          onClick={() => navigate('/invitation-sent')}
          className="h-12 rounded-2xl bg-brand-primary px-10 text-[15px] font-semibold text-white shadow-lg shadow-emerald-900/20"
        >
          Send Invitation
        </button>
      </div>
    </div>
  )
}