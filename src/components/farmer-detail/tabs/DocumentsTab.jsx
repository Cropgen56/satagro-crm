import { Download, Eye, RefreshCw, Sparkles, Upload } from 'lucide-react'

const docStats = [
  { label: 'Total Docs', value: '12' },
  { label: 'Verified', value: '08' },
  { label: 'Pending', value: '03' },
  { label: 'Expired', value: '01' },
]

const documents = [
  { title: 'Aadhaar Card', category: 'KYC', date: 'Jan 15, 2024', status: 'Verified', statusColor: 'bg-green-500', size: '1.2 MB' },
  { title: 'Land Record (7/12)', category: 'LAND', date: 'Feb 02, 2024', status: 'Verified', statusColor: 'bg-green-500', size: '4.5 MB' },
  { title: 'Subscription Agreement', category: 'AGREEMENT', date: 'Mar 10, 2024', status: 'Pending', statusColor: 'bg-amber-500', size: '2.1 MB', action: 'Verify' },
  { title: 'Soil Health Report', category: 'REPORT', date: 'Dec 01, 2023', status: 'Expired', statusColor: 'bg-gray-400', size: '850 KB', action: 'refresh' },
]

const activity = [
  { text: 'Soil Report Uploaded', time: '2 hours ago by Akash S.' },
  { text: 'Aadhaar Verified', time: 'Yesterday' },
  { text: 'Land Records Downloaded', time: '3 days ago' },
  { text: 'Document Renamed', time: 'May 10, 2024' },
]

export default function DocumentsTab() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {docStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">Farmer Documents</h3>
            <div className="flex gap-2">
              <button type="button" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Bulk Upload
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-950">
                <Upload className="h-4 w-4" />
                Upload Document
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">Document Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Upload Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.title} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{doc.title}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.category}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${doc.statusColor}`} />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doc.size}</td>
                    <td className="px-4 py-3">
                      {doc.action === 'Verify' ? (
                        <button type="button" className="rounded bg-brand-primary px-2 py-1 text-xs font-semibold text-white">
                          Verify
                        </button>
                      ) : doc.action === 'refresh' ? (
                        <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Refresh">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      ) : (
                        <div className="flex gap-1">
                          <button type="button" className="rounded p-1 text-gray-400 hover:bg-gray-100" aria-label="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button type="button" className="rounded p-1 text-gray-400 hover:bg-gray-100" aria-label="Download">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
              <span>Showing 4 of 12 documents</span>
              <div className="flex gap-2">
                <button type="button" className="rounded border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50">
                  Previous
                </button>
                <button type="button" className="rounded border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="relative mx-auto h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#0d5245"
                  strokeWidth="3"
                  strokeDasharray="45 100"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-primary">
                45% USED
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Current Usage</p>
            <p className="font-semibold text-gray-900">45 MB / 100 MB</p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900">Recent Activity</h4>
            <ul className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4 text-sm">
              {activity.map((item) => (
                <li key={item.text}>
                  <p className="font-medium text-gray-900">{item.text}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-3 text-sm font-semibold text-brand-primary hover:underline">
              View All Activity
            </button>
          </div>

          <div className="rounded-xl bg-brand-primary p-5 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h4 className="font-semibold">Smart Document Scan</h4>
            </div>
            <p className="mt-2 text-xs text-white/85">
              System has detected 2 higher quality duplicates of land records. Would you like to merge them?
            </p>
            <button type="button" className="mt-4 w-full rounded-lg bg-white py-2 text-sm font-semibold text-brand-primary hover:bg-gray-50">
              Review Duplicates
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
