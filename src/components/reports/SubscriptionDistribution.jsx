// SubscriptionDistribution.jsx

export default function SubscriptionDistribution() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-[28px] font-semibold text-brand-primary">
        Subscription Distribution
      </h3>

      <p className="text-sm text-[#7A7A7A]">
        User base by plan type
      </p>

      <div className="mt-8 flex justify-center">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[12px] border-[#005347] border-r-[#EAEAEA] border-b-[#EAEAEA]">
          <div className="text-center">
            <h4 className="text-[34px] font-bold text-[#111827]">
              8.1k
            </h4>

            <p className="text-sm text-[#7A7A7A]">
              Active Users
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-brand-primary" />
            Premium Tier
          </div>

          <span className="font-semibold">64%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#8DD3B0]" />
            Basic Tier
          </div>

          <span className="font-semibold">28%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#E4E4E4]" />
            Free/Trial
          </div>

          <span className="font-semibold">8%</span>
        </div>
      </div>
    </div>
  )
}