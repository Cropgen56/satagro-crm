import { MessageSquare } from 'lucide-react'

const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

export default function TaskCommentsTab({ task }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950"
        >
          <MessageSquare className="h-4 w-4" />
          Add Comment
        </button>
      </div>
      <div className="space-y-4">
        {task.comments.map((c) => (
          <div key={c.time} className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{c.author}</p>
              <p className="text-xs text-gray-500">{c.time}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
