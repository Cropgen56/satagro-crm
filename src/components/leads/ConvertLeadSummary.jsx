import { UserPlus } from 'lucide-react'

export default function ConvertLeadSummary({ summary }) {
  const items = [
    { label: 'Lead Name', value: summary.name },
    { label: 'Mobile', value: summary.mobile },
    { label: 'Location', value: summary.location },
    { label: 'Assigned Agent', value: summary.agent },
  ]

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Source</p>
            <span className="mt-1 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
              {summary.source}
            </span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
          <UserPlus className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
