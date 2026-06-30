import clsx from 'clsx'

export default function EcommerceStatGrid({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={clsx(
            'rounded-2xl border px-5 py-4 shadow-sm',
            item.accent || 'border-gray-100 bg-white',
          )}
        >
          <p
            className={clsx(
              'text-xs font-semibold uppercase tracking-wide',
              item.labelClass || 'text-gray-400',
            )}
          >
            {item.label}
          </p>
          <p
            className={clsx(
              'mt-1.5 text-2xl font-bold tabular-nums',
              item.valueClass || 'text-gray-900',
            )}
          >
            {item.value}
          </p>
          {item.hint ? (
            <p className="mt-1 text-xs text-gray-400">{item.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
