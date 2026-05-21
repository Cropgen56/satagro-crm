import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const monthlyData = [
  { month: 'JAN', farmers: 720 },
  { month: 'FEB', farmers: 850 },
  { month: 'MAR', farmers: 980 },
  { month: 'APR', farmers: 920 },
  { month: 'MAY', farmers: 1100 },
  { month: 'JUN', farmers: 1250 },
  { month: 'JUL', farmers: 1180 },
  { month: 'AUG', farmers: 1350 },
  { month: 'SEP', farmers: 1480 },
  { month: 'OCT', farmers: 1620 },
  { month: 'NOV', farmers: 1950 },
  { month: 'DEC', farmers: 2350 },
]

const barColors = [
  '#b8ddd4',
  '#a5d4c8',
  '#92ccbc',
  '#7fc3b0',
  '#6cbba4',
  '#59b298',
  '#46a98c',
  '#33a180',
  '#2a8f72',
  '#1f7d64',
  '#156b56',
  '#0d5245',
]

export default function FarmerGrowthChart() {
  const [period, setPeriod] = useState('monthly')

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">Farmer Growth Trend</h3>
        <div className="flex rounded-lg bg-gray-100 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setPeriod('weekly')}
            className={`rounded-md px-3 py-1.5 transition-all ${
              period === 'weekly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`rounded-md px-3 py-1.5 transition-all ${
              period === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={monthlyData} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(13, 82, 69, 0.05)' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
              fontSize: 12,
            }}
          />
          <Bar dataKey="farmers" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {monthlyData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
