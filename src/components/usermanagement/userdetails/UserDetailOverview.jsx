import { MapPin, Mail, Phone, ShieldCheck, Layers } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

export default function UserDetailOverview({ user, assignments = [] }) {
  if (!user) {
    return (
      <EmptyState
        title="No user details"
        description="User information could not be loaded."
      />
    )
  }

  const rows = [
    { icon: Mail, label: 'Email', value: user.email || '—' },
    { icon: Phone, label: 'Phone', value: user.phone || '—' },
    { icon: MapPin, label: 'Region', value: user.region || '—' },
    { icon: ShieldCheck, label: 'Role', value: user.role || '—' },
    { icon: ShieldCheck, label: 'Status', value: user.status || '—' },
    { icon: ShieldCheck, label: 'Assignment level', value: user.assignmentLevel || '—' },
    { icon: MapPin, label: 'Territory', value: user.territory || '—' },
    { icon: ShieldCheck, label: 'Last active', value: user.active || '—' },
  ]

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-primary">Overview</h3>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {assignments.length > 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-primary" />
            <h3 className="text-sm font-semibold text-brand-primary">Admin assignments</h3>
          </div>
          <ul className="mt-4 divide-y divide-gray-100">
            {assignments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 uppercase">{a.level}</p>
                  <p className="text-gray-500">
                    {[a.countryCode, a.stateCode, a.districtCode].filter(Boolean).join(' · ') ||
                      'Global scope'}
                  </p>
                </div>
                <span
                  className={
                    a.status === 'active'
                      ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800'
                      : 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800'
                  }
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
