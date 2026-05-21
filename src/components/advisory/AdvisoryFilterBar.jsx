import { CalendarDays } from 'lucide-react'
import { advisoryFilters } from '@/data/advisory'

export default function AdvisoryFilterBar({
  filters,
  setFilters,
}) {
  const baseSelectStyles =
    'h-10 rounded-xl border border-gray-200 bg-white px-4 text-[13px] font-medium text-[#0F172A] outline-none transition focus:border-[#064E3B]'

  return (
    <div className="mb-5 flex w-full flex-wrap items-center gap-2 xl:flex-nowrap">
      <select
        value={filters.type}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            type: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[160px] flex-1`}
      >
        {advisoryFilters.types.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>


      <select
        value={filters.crop}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            crop: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[150px] flex-1`}
      >
        {advisoryFilters.crops.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        value={filters.district}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            district: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[180px] flex-[1.2]`}
      >
        {advisoryFilters.districts.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            status: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[170px] flex-1`}
      >
        {advisoryFilters.status.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <select
        value={filters.createdBy}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            createdBy: e.target.value,
          }))
        }
        className={`${baseSelectStyles} min-w-[160px] flex-1`}
      >
        {advisoryFilters.createdBy.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <div className="flex h-10 min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-500" />

        <select
          value={filters.date}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              date: e.target.value,
            }))
          }
          className="flex-1 bg-transparent text-[13px] font-medium text-[#0F172A] outline-none"
        >
          {advisoryFilters.date.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
    </div>
  )
}