import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Premium Plan', value: 62, color: '#0d5245' },
  { name: 'Standard Plan', value: 28, color: '#f97316' },
  { name: 'Basic Plan', value: 10, color: '#3b82f6' },
]

export default function SubscriptionDonutChart() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-2 text-[15px] font-semibold text-gray-900">Subscription Breakdown</h3>

      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-[22px] font-bold leading-none text-gray-900">8.4k</span>
          <span className="mt-1 text-[9px] font-semibold tracking-widest text-gray-400">
            TOTAL ACTIVE
          </span>
        </div>
      </div>

      <ul className="mt-1 space-y-2.5">
        {data.map((item) => (
          <li key={item.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-gray-800">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
