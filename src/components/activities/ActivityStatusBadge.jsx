import clsx from 'clsx'

const styles = {
  completed: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  scheduled: 'bg-blue-50 text-blue-700',
  missed: 'bg-red-50 text-red-700',
}

const labels = {
  completed: 'Completed',
  pending: 'Pending',
  scheduled: 'Scheduled',
  missed: 'Missed',
}

export default function ActivityStatusBadge({ status }) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
        styles[status] || styles.pending,
      )}
    >
      {labels[status] || status}
    </span>
  )
}
