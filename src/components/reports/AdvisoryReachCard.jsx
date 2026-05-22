// AdvisoryReachCard.jsx

export default function AdvisoryReachCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-[28px] font-semibold text-brand-primary">
        Advisory Reach
      </h3>

      <p className="text-sm text-[#7A7A7A]">
        Geospatial distribution of advice
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
          alt=""
          className="h-[300px] w-full object-cover"
        />
      </div>
    </div>
  )
}