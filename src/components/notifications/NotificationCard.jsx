// NotificationCard.jsx

import clsx from 'clsx'
import {
  AlertTriangle,
  CalendarClock,
  MessageSquareWarning,
  UserRoundPlus,
} from 'lucide-react'

const icons = {
  critical: AlertTriangle,
  warning: CalendarClock,
  advisory: MessageSquareWarning,
  info: UserRoundPlus,
}

const badgeStyles = {
  critical: 'bg-[#FCE8E6] text-[#D93025]',
  warning: 'bg-[#FEF3E2] text-[#E57C00]',
  info: 'bg-[#E8F0FE] text-[#2563EB]',
}

const borderStyles = {
  critical: 'border-l-[#D93025]',
  warning: 'border-l-[#E57C00]',
  info: 'border-l-[#2563EB]',
}

const iconBg = {
  critical: 'bg-[#FCE8E6] text-[#D93025]',
  warning: 'bg-[#FEF3E2] text-[#E57C00]',
  info: 'bg-[#E8F0FE] text-[#2563EB]',
}

export default function NotificationCard({
  title,
  description,
  type,
  actionText,
  time,
  unread,
}) {
  const Icon = icons[type] || AlertTriangle

  return (
    <div
      className={clsx(
        'relative rounded-2xl border border-[#E8E8E8] border-l-4 bg-white p-6 shadow-sm',
        borderStyles[type]
      )}
    >

      {unread && (
        <div className="absolute right-6 top-6 h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
      )}

      <div className="flex gap-4">
        

        <div
          className={clsx(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
            iconBg[type]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>


        <div className="flex-1">
          

          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[18px] font-semibold text-[#1E1E1E]">
              {title}
            </h3>

            <span
              className={clsx(
                'rounded-md px-2 py-1 text-[10px] font-bold uppercase',
                badgeStyles[type]
              )}
            >
              {type}
            </span>
          </div>


          <p className="mt-2 max-w-[90%] text-[15px] leading-7 text-[#555]">
            {description}
          </p>


          <div className="mt-5 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <button className="rounded-lg bg-brand-primary px-5 py-2 text-[14px] font-semibold text-white hover:bg-brand-950">
                {actionText}
              </button>

              <button className="text-[14px] font-medium text-[#7B7B7B] hover:text-black">
                Dismiss
              </button>
            </div>

            <p className="text-[14px] font-medium text-[#8A8A8A]">
              {time}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}