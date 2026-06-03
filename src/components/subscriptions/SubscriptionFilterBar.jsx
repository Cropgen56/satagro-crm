import { CalendarDays } from 'lucide-react'
import { subscriptionFilters } from '@/lib/moduleConstants'

export default function SubscriptionFilterBar({
  filters,
  setFilters,
}) {
  const baseSelectStyles =
    'h-10 rounded-xl border border-gray-200 bg-white px-4 text-[13px] font-medium text-[#0F172A] outline-none transition focus:border-[#064E3B]'

  return (
    <div className="mb-5 flex w-full flex-wrap items-center gap-2 xl:flex-nowrap">
      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            status: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[140px] flex-1`}
      >
        {subscriptionFilters.status.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      {/* Plan */}
      <select
        value={filters.plan}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            plan: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[170px] flex-1`}
      >
        <option>Plan Type</option>

        {subscriptionFilters.planTypes.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      {/* District */}
      <select
        value={filters.district}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            district: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[190px] flex-[1.2]`}
      >
        <option>District</option>

        {subscriptionFilters.districts.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      {/* Agent */}
      <select
        value={filters.agent}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            agent: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[150px] flex-1`}
      >
        <option>Agent</option>

        {subscriptionFilters.agents.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      {/* Expiry */}
      <div className="flex h-10 min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4">
        <span className="text-[13px] font-medium text-[#0F172A]">
          Expiry:
        </span>

        <select
          value={filters.expiry}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              expiry: e.target.value,
            }))
          }
          className="flex-1 bg-transparent text-[13px] font-semibold text-[#064E3B] outline-none"
        >
          {subscriptionFilters.expiry.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-500" />
      </div>
    </div>
  )
}