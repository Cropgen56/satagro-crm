// components/usermanagement/region-rules/RegionRulesFooter.jsx

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function RegionRulesFooter() {
  const navigate = useNavigate()

  return (
    <div className="mt-7 flex items-center justify-between border-t border-[#E5E7EB] pt-5">
      <button
        onClick={() => navigate('/configure-permissions')}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#374151]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <button
        onClick={() => navigate('/role-settings')}
        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-brand-primary px-8 text-sm font-semibold text-white shadow-sm"
      >
        Continue to Access Policies
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}