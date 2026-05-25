import {
  Search,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react'

export default function RegionAssignTree() {
  return (
    <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-5">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />

        <input
          placeholder="Search Country/State/District..."
          className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F5F7F6] pl-12 pr-4 text-[15px] outline-none"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {['India', 'Maharashtra', 'Pune'].map((item) => (
          <div
            key={item}
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-1.5 text-[13px] font-medium text-white"
          >
            {item}
            <span>×</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center gap-3">
            <ChevronDown className="h-4 w-4" />

            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-primary">
              <Check className="h-3 w-3 text-white" />
            </div>

            <p className="text-[18px] font-semibold text-brand-primary">
              India
            </p>
          </div>

          <div className="ml-[18px] mt-4 border-l border-[#D1D5DB] pl-6">
            <div className="flex items-center gap-3">
              <ChevronDown className="h-4 w-4" />

              <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-primary">
                <Check className="h-3 w-3 text-white" />
              </div>

              <p className="text-[17px] font-medium text-[#202939]">
                Maharashtra
              </p>
            </div>

            <div className="ml-[18px] mt-5 border-l border-[#D1D5DB] pl-6">
              <div className="rounded-xl bg-[#F3F6F5] px-3 py-3">
                <div className="flex items-center gap-3">
                  <ChevronDown className="h-4 w-4" />

                  <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-primary">
                    <Check className="h-3 w-3 text-white" />
                  </div>

                  <p className="text-[17px] font-semibold text-brand-primary">
                    Pune
                  </p>
                </div>
              </div>

              <div className="ml-[18px] mt-4 border-l border-[#D1D5DB] pl-6 space-y-5">
                {['Haveli', 'Mulshi', 'Baramati'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-primary">
                      <Check className="h-3 w-3 text-white" />
                    </div>

                    <p className="text-[17px] text-[#202939]">
                      {item}
                    </p>
                  </div>
                ))}

                <div className="flex items-center gap-3">
                  <ChevronRight className="h-4 w-4" />

                  <div className="h-5 w-5 rounded border border-[#CBD5D1]" />

                  <p className="text-[17px] text-[#202939]">
                    Nashik
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}