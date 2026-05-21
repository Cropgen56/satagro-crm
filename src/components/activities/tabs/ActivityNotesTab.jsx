import { NotebookPen } from 'lucide-react'

const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

export default function ActivityNotesTab({ activity }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950"
        >
          <NotebookPen className="h-4 w-4" />
          Add Note
        </button>
      </div>
      <div className="space-y-4">
        {activity.notes.map((note) => (
          <div key={note.date} className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{note.author}</p>
              <p className="text-xs text-gray-500">{note.date}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
