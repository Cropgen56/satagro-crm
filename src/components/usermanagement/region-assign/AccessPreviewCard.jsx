import { HelpCircle } from 'lucide-react'

export default function AccessPreviewCard() {
  return (
    <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold uppercase tracking-wide text-brand-primary">
          Access Preview Matrix
        </h3>

        <HelpCircle className="h-5 w-5 text-brand-primary" />
      </div>
    </div>
  )
}