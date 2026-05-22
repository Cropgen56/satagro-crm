// SupportCard.jsx

export default function SupportCard() {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <h3 className="text-[18px] font-semibold text-[#1F2937]">
        Need Assistance?
      </h3>

      <div className="mt-6 space-y-3">
        <button className="w-full rounded-2xl border border-[#CAD3CF] bg-[#F8FAF9] py-3 text-[15px] font-semibold text-brand-primary">
          Contact Support
        </button>

        <button className="w-full rounded-2xl border border-[#CAD3CF] bg-[#F8FAF9] py-3 text-[15px] font-semibold text-[#374151]">
          View Knowledge Base
        </button>
      </div>
    </div>
  )
}