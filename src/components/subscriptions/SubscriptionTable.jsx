import clsx from 'clsx'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreVertical,
  ShieldCheck,
  XCircle,
} from 'lucide-react'

const columns = [
  'Farmer',
  'Sub ID',
  'Plan',
  'Duration',
  'Amount',
  'Status',
  'Agent',
  'Actions',
]

const statusIcons = {
  Active: CheckCircle2,
  'Expiring Soon': Clock3,
  'Free Trial': ShieldCheck,
  Expired: XCircle,
}

const actionStyles = {
  primary:
    'bg-[#D97706] text-white hover:bg-[#C56B05] border border-[#D97706]',
  secondary:
    'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
  danger:
    'border border-red-200 bg-white text-red-600 hover:bg-red-50',
}

export default function SubscriptionTable({ subscriptions }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FAFAFA]">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((subscription) => {
              const StatusIcon =
                statusIcons[subscription.status.label] || CheckCircle2

              return (
                <tr
                  key={subscription.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40"
                >
                  {/* Farmer */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        <img
                          src={subscription.farmer.avatar}
                          alt={subscription.farmer.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />

                        <span
                          className={clsx(
                            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white',
                            subscription.farmer.online
                              ? 'bg-green-500'
                              : 'bg-red-400'
                          )}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#0F172A]">
                          {subscription.farmer.name}
                        </p>

                        <p className="truncate text-[11px] text-gray-400">
                          {subscription.farmer.district}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Subscription ID */}
                  <td className="px-3 py-4">
                    <p className="truncate text-[11px] font-semibold text-[#667085]">
                      {subscription.subscriptionId}
                    </p>
                  </td>

                  {/* Plan */}
                  <td className="px-3 py-4">
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase whitespace-nowrap',
                        subscription.plan.badge
                      )}
                    >
                      {subscription.plan.name}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-3 py-4">
                    <div>
                      <p className="text-[12px] font-semibold text-[#0F172A]">
                        {subscription.duration.start}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        to {subscription.duration.end}
                      </p>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-3 py-4">
                    <p className="text-[13px] font-bold text-[#064E3B]">
                      {subscription.amount}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-4">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap',
                        subscription.status.badge
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {subscription.status.label}
                    </span>
                  </td>

                  {/* Agent */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={clsx(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                          subscription.agent.color
                        )}
                      >
                        {subscription.agent.initials}
                      </div>

                      <span className="truncate text-[12px] text-[#0F172A]">
                        {subscription.agent.name}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={clsx(
                          'whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200',
                          actionStyles[subscription.action.variant]
                        )}
                      >
                        {subscription.action.label}
                      </button>

                      <button
                        type="button"
                        className="text-gray-400 transition hover:text-gray-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row">
        <p className="text-[12px] text-gray-500">
          Showing <span className="font-semibold text-gray-700">1-10</span> of{' '}
          <span className="font-semibold text-gray-700">1,284</span> entries
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-400 hover:bg-gray-50"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-semibold transition',
                page === 1
                  ? 'bg-[#064E3B] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          ))}

          <span className="px-1 text-sm text-gray-400">...</span>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-semibold text-gray-500 hover:bg-gray-100"
          >
            128
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-[#064E3B] hover:bg-gray-50"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}