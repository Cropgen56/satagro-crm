import clsx from 'clsx'
import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'No data yet',
  description = 'There is nothing to show here right now.',
  className,
  icon: Icon = Inbox,
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm',
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  )
}

export function UserAvatar({ name, avatar, className }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || ''}
        className={clsx('rounded-full object-cover', className)}
      />
    )
  }
  const initial = (name || '?').charAt(0).toUpperCase()
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full bg-brand-primary font-semibold text-white',
        className,
      )}
    >
      {initial}
    </div>
  )
}
