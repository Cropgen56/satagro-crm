import { BadgeCheck, MessageCircle, Phone } from 'lucide-react'

export default function FarmerProfileHeader({ farmer }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="h-28 w-28 rounded-xl object-cover sm:h-32 sm:w-32"
            />
            <span className="absolute bottom-2 left-2 rounded bg-teal-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              ID: {farmer.displayId}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">{farmer.name}</h1>
              {farmer.verified && <BadgeCheck className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {farmer.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400" />
              {farmer.phone}
            </p>
          </div>
        </div>

        <div className="min-w-[240px] rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
            Assigned Agent
          </p>
          <div className="mt-3 flex items-center gap-3">
            <img
              src={farmer.agent.avatar}
              alt={farmer.agent.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{farmer.agent.name}</p>
              <p className="text-xs text-gray-500">{farmer.agent.role}</p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white p-2 text-brand-primary hover:bg-brand-light"
              aria-label="Message agent"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
