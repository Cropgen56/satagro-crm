export default function TaskEfficiencyWidget() {
  const metrics = [
    { label: 'Completion Velocity', value: '+12.5%', width: '75%', positive: true },
    { label: 'Average Resolution Time', value: '-2.4 hrs', width: '60%', positive: true },
  ]

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900">Task Efficiency</h3>
      <div className="mt-6 space-y-6">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">{m.label}</span>
              <span className={`font-semibold ${m.positive ? 'text-green-600' : 'text-red-600'}`}>
                {m.value}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-green-500" style={{ width: m.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
