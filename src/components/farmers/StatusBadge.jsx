import clsx from 'clsx'

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-green-50 text-green-700',
  },
  registered: {
    label: 'Registered',
    className: 'bg-blue-50 text-blue-600',
  },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'bg-gray-100 text-gray-600',
  }

  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}
