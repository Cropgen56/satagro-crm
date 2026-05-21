import { Calendar, Check, Layers, Rocket, Star } from 'lucide-react'

const payments = [
  { date: 'Jan 12, 2024', plan: 'Premium Enterprise', amount: '$1,200', status: 'Paid' },
  { date: 'Jan 12, 2023', plan: 'Standard', amount: '$800', status: 'Paid' },
]

const timeline = [
  { title: 'Plan Upgraded', date: 'Mar 05, 2024' },
  { title: 'Renewal Completed', date: 'Jan 12, 2024' },
  { title: 'Subscription Activated', date: 'Jan 12, 2023' },
]

const benefits = [
  'Daily Satellite Imaging',
  'Unlimited Soil Test Reports',
  'Priority Advisory Support',
  'Field Health Monitoring',
]

export default function SubscriptionTab({ farmer }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Land Area', value: `${farmer.stats.totalLand} Acres` },
          { label: 'Active Fields', value: farmer.stats.activeFields },
          { label: 'Irrigated Area', value: `${farmer.stats.irrigated} Acres` },
          { label: 'Active Crops', value: farmer.stats.activeCrops },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Star, label: 'Current Plan', value: 'Premium Enterprise' },
          { icon: Check, label: 'Subscription Status', value: 'Active', green: true },
          { icon: Calendar, label: 'Renewal Date', value: 'Oct 24, 2024' },
          { icon: Layers, label: 'Total Coverage', value: `${farmer.stats.totalLand} Acres` },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 border-gray-100 sm:border-r last:border-0 sm:pr-4">
            <item.icon className="h-5 w-5 text-brand-primary" />
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className={`text-sm font-semibold ${item.green ? 'text-green-600' : 'text-gray-900'}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-gray-900">Current Subscription Plan</h3>
              <div className="flex gap-2">
                <button type="button" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Renew Plan
                </button>
                <button type="button" className="rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-950">
                  Upgrade Plan
                </button>
              </div>
            </div>
            <dl className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Plan Name', 'Premium Enterprise'],
                ['Type', 'Annual Cycle'],
                ['Billing Amount', '$1,200 / Year'],
                ['Activation Date', 'Jan 12, 2023'],
                ['Expiry Date', 'Oct 24, 2024'],
                ['Payment Status', 'Paid'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-gray-500">{label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-8">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">Usage Tracking</span>
                <span className="font-medium text-gray-900">82% Utilized (24.5 / 30.0 Acres)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[82%] rounded-full bg-brand-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Payment History</h3>
              <button type="button" className="text-xs font-semibold text-brand-primary hover:underline">
                See All &gt;
              </button>
            </div>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((row) => (
                  <tr key={row.date} className="border-b border-gray-50">
                    <td className="py-3 text-gray-700">{row.date}</td>
                    <td className="py-3 text-gray-700">{row.plan}</td>
                    <td className="py-3 text-gray-700">{row.amount}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
            <ul className="mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
              {timeline.map((event) => (
                <li key={event.title} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-8 border-brand-light">
              <div>
                <p className="text-2xl font-bold text-brand-primary">212</p>
                <p className="text-xs font-semibold text-gray-600">DAYS REMAINING</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Subscription Insights</p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Rocket className="h-5 w-5 text-blue-600" />
            <p className="mt-2 text-sm font-medium text-gray-900">Upgrade to Platinum</p>
            <p className="mt-1 text-xs text-gray-600">Get advanced analytics and priority support.</p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-medium text-gray-900">Billing Reminder</p>
            <p className="mt-1 text-xs text-gray-600">Next billing cycle starts in 30 days.</p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900">Plan Benefits Included</h4>
            <ul className="mt-3 space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-600" />
                  {b}
                </li>
              ))}
            </ul>
            <button type="button" className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Detailed Plan Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
