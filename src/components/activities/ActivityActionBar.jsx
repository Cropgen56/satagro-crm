import {
  Calendar,
  CheckCircle,
  FileText,
  Phone,
  X,
} from 'lucide-react'

export default function ActivityActionBar() {
  const secondary = [
    { label: 'Reschedule', icon: Calendar },
    { label: 'Add Note', icon: FileText },
    { label: 'Call Farmer', icon: Phone },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
      >
        <CheckCircle className="h-4 w-4" />
        Mark Complete
      </button>
      {secondary.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
        Cancel Activity
      </button>
    </div>
  )
}
