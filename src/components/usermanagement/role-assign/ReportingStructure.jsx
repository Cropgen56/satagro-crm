import { ChevronDown } from 'lucide-react'

export default function ReportingStructure() {
  return (
    <div>
      <h2 className="text-[16px] font-semibold text-[#202939]">
        Reporting Structure
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-[#4B5563]">
            Parent Admin (Country)
          </label>

          <div className="flex h-12 items-center justify-between rounded-xl border border-[#CBD5D1] px-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />

              <div>
                <p className="text-[13px] font-semibold text-[#202939]">
                  Marcus Thorne
                </p>

                <p className="text-[10px] text-[#6B7280]">
                  COUNTRY ADMIN (INDIA)
                </p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-[#6B7280]" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-[#4B5563]">
            Reporting Manager
          </label>

          <div className="flex h-12 items-center justify-between rounded-xl border border-[#CBD5D1] px-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />

              <div>
                <p className="text-[13px] font-semibold text-[#202939]">
                  Sarah Jenkins
                </p>

                <p className="text-[10px] text-[#6B7280]">
                  OPERATIONS DIRECTOR
                </p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-[#6B7280]" />
          </div>
        </div>
      </div>
    </div>
  )
}