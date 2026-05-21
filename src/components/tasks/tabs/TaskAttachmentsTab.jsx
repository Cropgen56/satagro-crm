import { Download, Paperclip, Upload } from 'lucide-react'

const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

export default function TaskAttachmentsTab({ task }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>
      <div className="space-y-3">
        {task.attachments.map((file) => (
          <div
            key={file.name}
            className={`flex items-center justify-between ${cardClass}`}
          >
            <div className="flex items-center gap-3">
              <Paperclip className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
              </div>
            </div>
            <button type="button" className="rounded p-2 text-gray-400 hover:bg-gray-100">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
