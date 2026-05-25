// components/usermanagement/create-role/CreateRoleFooter.jsx

import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CreateRoleFooter() {
  const navigate = useNavigate()

  return (
    <div className="mt-7 flex items-center justify-between border-t border-[#E5E7EB] pt-5">
      <p className="text-xs text-[#6B7280]">
        ✣ Fields marked with <span className="text-red-500">*</span> are required for role creation.
      </p>

      <div className="flex items-center gap-5">
        <button
          onClick={() => navigate('/role-settings')}
          className="cursor-pointer text-sm font-semibold text-[#374151]"
        >
          Cancel
        </button>

        <button
          onClick={() => navigate('/configure-permissions')}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-brand-primary px-7 text-sm font-semibold text-white shadow-sm"
        >
          Continue to Configure Permissions
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}