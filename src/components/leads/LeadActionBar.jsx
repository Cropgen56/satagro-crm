import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  Calendar,
  HeartCrack,
  NotebookPen,
  Phone,
} from 'lucide-react'

export default function LeadActionBar({ leadId }) {
  const navigate = useNavigate()

  const secondary = [
    { label: 'Call Lead', icon: Phone },
    { label: 'Add Note', icon: NotebookPen },
    { label: 'Schedule Follow-up', icon: Calendar },
    { label: 'Mark Lost', icon: HeartCrack },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
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
        onClick={() => navigate(`/leads/${leadId}/convert`)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
      >
        <BadgeCheck className="h-4 w-4" />
        Convert to Farmer
      </button>
    </div>
  )
}
