// components/usermanagement/configure-permissions/ConfigurePermissionsFooter.jsx

import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ConfigurePermissionsFooter() {
  const navigate = useNavigate()

  return (
    <div className="mt-7 flex items-center justify-between border-t border-[#BFC8C5] pt-6">
      <button
        onClick={() => navigate('/role-settings')}
        className="inline-flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-[#374151]"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Roles
      </button>

      <button
        onClick={() => navigate('/region-rules')}
        className="inline-flex h-12 cursor-pointer items-center gap-3 rounded-xl bg-brand-primary px-8 text-[15px] font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-brand-950"
      >
        Continue to Region Rules
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}