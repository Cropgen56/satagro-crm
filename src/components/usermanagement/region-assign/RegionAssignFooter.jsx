// RegionAssignFooter.jsx

import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function RegionAssignFooter() {
  const navigate = useNavigate()

  return (
    <div className="mt-8 flex items-center justify-between border-t border-[#E5E7EB] pt-6">
      <button
        onClick={() => navigate('/role-assignment')}
        className="text-sm font-semibold text-[#374151]"
      >
        Previous Step: User Details
      </button>

      <div className="flex items-center gap-4">
        <button className="text-sm font-semibold text-[#374151]">
          Discard
        </button>

        <button
          onClick={() => navigate('/permissions-review')}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-7 text-sm font-semibold text-white shadow-sm"
        >
          Continue to Permissions Review
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}