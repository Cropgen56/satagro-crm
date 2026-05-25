export default function RegionAssignMap() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-white">
      <img
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
        alt=""
        className="h-[290px] w-full object-cover grayscale"
      />

      <div className="absolute left-6 top-6 rounded-xl bg-brand-primary px-5 py-3 shadow-sm">
        <p className="text-[13px] font-semibold leading-5 text-white">
          Active Selection:
          <br />
          Pune District
        </p>
      </div>

      <div className="absolute right-6 top-6 rounded-xl bg-white px-4 py-2 shadow-sm">
        <p className="text-[15px] font-semibold text-brand-primary">
          142 Villages
        </p>
      </div>
    </div>
  )
}