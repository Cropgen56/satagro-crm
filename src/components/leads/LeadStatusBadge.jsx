import clsx from 'clsx'

const styles = {
  new: 'bg-blue-50 text-blue-700',
  'follow-up': 'bg-amber-50 text-amber-700',
  converted: 'bg-green-50 text-green-700',
  lost: 'bg-red-50 text-red-700',
}

const labels = {
  new: 'NEW',
  'follow-up': 'FOLLOW-UP',
  converted: 'CONVERTED',
  lost: 'LOST',
}

export default function LeadStatusBadge({ status }) {
  return (
    <span
      className={clsx(
        'inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        styles[status] || styles.new,
      )}
    >
      {labels[status] || status}
    </span>
  )
}
