import {
  CheckSquare,
  Home,
  NotebookPen,
  Phone,
  RefreshCw,
} from 'lucide-react'

const actions = [
  { label: 'Call Farmer', icon: Phone, primary: true },
  { label: 'Add Note', icon: NotebookPen },
  { label: 'Log Visit', icon: Home },
  { label: 'Renew Subscription', icon: RefreshCw },
  { label: 'Create Task', icon: CheckSquare },
]

export default function FarmerActionBar() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map(({ label, icon: Icon, primary }) => (
        <button
          key={label}
          type="button"
          className={
            primary
              ? 'inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-950'
              : 'inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
