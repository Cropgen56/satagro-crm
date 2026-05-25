import {
  Eye,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

export default function RolePreviewCard() {
  return (
    <div className="rounded-2xl border border-[#E4E8E7] bg-[#FAFBFA] p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-brand-primary" />

        <h2 className="text-[15px] font-semibold text-[#202939]">
          Role Preview
        </h2>
      </div>

      <p className="mt-5 text-[13px] leading-7 text-[#4B5563]">
        State Admins can manage district operators and farmers within assigned states.
      </p>

      <div className="mt-5 border-t border-[#E5E7EB] pt-5">
        <h4 className="text-[11px] font-bold uppercase tracking-wide text-[#374151]">
          Key Permissions
        </h4>

        <div className="mt-4 space-y-3">
          {[
            'Manage State-wide resource distribution',
            'Approve/Reject Field Agent logs',
            'Generate Regional Yield Analytics',
            'State-level farmer onboarding',
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-primary" />

              <p className="text-[12px] leading-5 text-[#4B5563]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-brand-primary p-4 text-white">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide">
              Contextual Hint
            </p>

            <p className="mt-2 text-[11px] leading-5 text-[#D9F5EB]">
              State Admins require 2FA authentication for delete operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}