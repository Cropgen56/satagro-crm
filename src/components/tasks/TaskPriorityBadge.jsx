import clsx from 'clsx'

const styles = {
  high: 'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-green-50 text-green-700',
}

export default function TaskPriorityBadge({ priority }) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase',
        styles[priority] || styles.medium,
      )}
    >
      {priority}
    </span>
  )
}
