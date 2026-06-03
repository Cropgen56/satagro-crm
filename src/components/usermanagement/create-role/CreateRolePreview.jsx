// components/usermanagement/create-role/CreateRolePreview.jsx

import {
  CheckCircle2,
} from 'lucide-react'

export default function CreateRolePreview() {
  return (
    <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-[13px] font-bold uppercase tracking-wide text-gray-300">
        Role Preview & Insights
      </h3>

      <p className="mt-7 text-sm leading-6 text-[#4B5563]">
        Based on the <span className="text-brand-primary">Super Admin</span> level placement, this role will have system-wide visibility.
      </p>

      <div className="mt-4">
        <div className="h-2 rounded-full bg-[#D9DEDB]">
          <div className="h-full w-[94%] rounded-full bg-brand-primary" />
        </div>

        <div className="mt-2 flex justify-between text-[10px] uppercase text-gray-500">
          <span>Limited Scope</span>
          <span>System-Wide Access</span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#CBD5D1] bg-[#F8FAF9] p-4">
        <h4 className="text-[12px] font-bold uppercase text-brand-primary">
          Operational Visibility
        </h4>

        <div className="mt-4 space-y-3">
          {[
            'Full Access to Financial Reports',
            'Field Officer Oversight (National)',
            'Infrastructure Management',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-primary" />

              <span className="text-xs text-[#202939]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-brand-primary/10 p-4 text-xs leading-5 text-brand-primary">
        Role preview reflects permissions you configure. Save the role to persist when
        the roles API is connected.
      </div>
    </div>
  )
}