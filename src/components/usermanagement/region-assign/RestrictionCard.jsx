import { Lock } from 'lucide-react'

export default function RestrictionCard() {
  return (
    <div className="rounded-[22px] border border-[#F3D1D1] bg-white p-5">
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5 text-[#DC2626]" />

        <h3 className="text-[18px] font-semibold text-[#DC2626]">
          Operational Restrictions
        </h3>
      </div>
    </div>
  )
}