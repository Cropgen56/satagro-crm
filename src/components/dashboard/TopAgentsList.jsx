const agents = [
  {
    name: 'Arjun Sharma',
    region: 'North Region',
    farmers: 342,
    tasks: 28,
    conversion: 94,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Priya Patel',
    region: 'West Region',
    farmers: 298,
    tasks: 24,
    conversion: 91,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Rahul Verma',
    region: 'East Region',
    farmers: 276,
    tasks: 31,
    conversion: 88,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Sneha Gupta',
    region: 'South Region',
    farmers: 254,
    tasks: 19,
    conversion: 86,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  },
]

export default function TopAgentsList() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">Top Performing Agents</h3>
        <button
          type="button"
          className="text-[11px] font-semibold tracking-wide text-brand-primary hover:underline"
        >
          VIEW ALL
        </button>
      </div>

      <div className="mb-2 hidden grid-cols-[1fr_70px_70px_60px] gap-2 px-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:grid">
        <span>Agent</span>
        <span className="text-center">Farmers</span>
        <span className="text-center">Tasks</span>
        <span className="text-right">Conv.</span>
      </div>

      <ul className="divide-y divide-gray-50">
        {agents.map((agent) => (
          <li
            key={agent.name}
            className="grid grid-cols-[1fr_auto] items-center gap-3 py-3.5 first:pt-0 sm:grid-cols-[1fr_70px_70px_60px]"
          >
            <div className="flex items-center gap-3">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{agent.name}</p>
                <p className="text-xs text-gray-400">{agent.region}</p>
              </div>
            </div>
            <p className="hidden text-center text-sm text-gray-600 sm:block">{agent.farmers}</p>
            <p className="hidden text-center text-sm text-gray-600 sm:block">{agent.tasks}</p>
            <div className="text-right">
              <p className="text-sm font-bold text-green-500">{agent.conversion}%</p>
              <p className="text-[10px] font-medium tracking-wider text-gray-400 sm:hidden">
                CONV.
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
