import { Info } from 'lucide-react'

export default function RegionAssignSidebar() {
  return (
    <div className="space-y-5">
      <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
            alt=""
            className="h-16 w-16 rounded-full border-2 border-[#A7F3D0] object-cover"
          />

          <div>
            <h3 className="text-[18px] font-semibold leading-5 text-brand-primary">
              Marcus Thorne
            </h3>

            <p className="mt-1 text-[13px] leading-5 text-[#4B5563]">
              State Admin
              <br />
              Manager: Sarah Jenkins
            </p>
          </div>
        </div>

        <div className="my-5 border-t border-[#E5E7EB]" />

        <div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-[4px] border border-brand-primary" />

            <p className="text-[13px] font-semibold uppercase tracking-wide text-brand-primary">
              Hierarchy Position
            </p>
          </div>

          <div className="mt-4 border-l border-[#D7DEDB] pl-4">
            <p className="text-[13px] text-[#6B7280]">
              Executive Ops
            </p>

            <p className="mt-2 text-[13px] text-[#4B5563]">
              Regional Director
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-brand-primary" />

              <p className="text-[14px] font-semibold text-brand-primary">
                State Admin (Level 3)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-[#D8EEE7] bg-[#F2FBF8] p-5">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-brand-primary" />

          <h3 className="text-[15px] font-semibold text-brand-primary">
            Access Note
          </h3>
        </div>

        <p className="mt-3 text-[14px] leading-7 text-[#4B5563]">
          Region visibility is limited by hierarchy level.
          Marcus can only assign territories within the assigned
          “Western Zone” jurisdiction.
        </p>
      </div>
    </div>
  )
}