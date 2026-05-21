import { Paperclip, Upload } from 'lucide-react'

export default function ActivityAttachmentsTab() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
      <Paperclip className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No attachments yet</h3>
      <p className="mt-2 text-sm text-gray-500">Upload photos, reports, or documents for this activity.</p>
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
      >
        <Upload className="h-4 w-4" />
        Upload Attachment
      </button>
    </div>
  )
}
