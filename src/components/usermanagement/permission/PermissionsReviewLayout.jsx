// components/usermanagement/permission/PermissionsReviewLayout.jsx

import { useNavigate } from 'react-router-dom'
import PermissionUserSummary from './PermissionUserSummary'
import PermissionReviewCards from './PermissionReviewCards'
import PermissionReviewFooter from './PermissionReviewFooter'

export default function PermissionsReviewLayout() {
  const navigate = useNavigate()

  return (
    <div className="rounded-[26px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-brand-primary">
            Permissions Review
          </h1>

          <p className="mt-1 text-[15px] text-[#6B7280]">
            Review hierarchy, territory access, and permissions before sending invitation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/region-assignment')}
            className="h-12 rounded-2xl border border-[#B8C2BE] px-8 text-[15px] font-semibold text-[#6B7280]"
          >
            Back
          </button>

          <button className="h-12 rounded-2xl border border-[#B8C2BE] px-8 text-[15px] font-semibold text-[#6B7280]">
            Edit Access
          </button>
        </div>
      </div>

      <PermissionUserSummary />
      <PermissionReviewCards />
      <PermissionReviewFooter />
    </div>
  )
}