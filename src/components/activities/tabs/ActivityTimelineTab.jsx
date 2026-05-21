const cardClass = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'

export default function ActivityTimelineTab({ activity }) {
  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
      <ul className="mt-8 space-y-6 border-l-2 border-gray-100 pl-6">
        {activity.timeline.map((event) => (
          <li key={event.title} className="relative">
            <span
              className={`absolute -left-[29px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                event.done ? 'bg-brand-primary' : 'bg-gray-300'
              }`}
            />
            <p className="font-semibold text-gray-900">{event.title}</p>
            <p className="text-sm text-gray-500">{event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
