import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LogActivitySidebar({ farmer }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-20 bg-brand-primary" />
        <div className="relative px-6 pb-6 pt-12">
          <img
            src={farmer.avatar}
            alt={farmer.name}
            className="absolute -top-10 left-6 h-20 w-20 rounded-xl border-4 border-white object-cover shadow-md"
          />
          <h3 className="mt-2 text-lg font-bold text-gray-900">{farmer.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Premium Member
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-50 pb-3">
              <dt className="text-gray-500">Last Activity</dt>
              <dd className="font-medium text-gray-900">{farmer.lastActivity}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-3">
              <dt className="text-gray-500">Subscription</dt>
              <dd>
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
                  {farmer.tier}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Risk Level</dt>
              <dd className="mt-2 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-1/4 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-semibold text-green-600">{farmer.risk}</span>
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => navigate('/farmers')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            View Full Profile
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900">Recent Activity Log</h4>
        <ul className="mt-4 space-y-4">
          {farmer.recent.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
