import {
  Calendar,
  CheckCircle,
  MessageSquare,
  Pencil,
  UserPlus,
  X,
} from 'lucide-react'

export default function TaskActionBar() {
  const actions = [
    { label: 'Edit Task', icon: Pencil },
    { label: 'Reassign', icon: UserPlus },
    { label: 'Add Comment', icon: MessageSquare },
    { label: 'Reschedule', icon: Calendar },
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
      {actions.map(({ label, icon: Icon }) => (
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
        className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
      >
        <X className="h-4 w-4" />
        Cancel Task
      </button>
    </div>
  )
}
