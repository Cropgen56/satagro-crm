import { Check, Circle } from 'lucide-react'

const steps = [
  {
    title: 'Lead Status → Converted',
    desc: 'Lead will move to the master farmer list and exit the active pipeline.',
    done: true,
  },
  {
    title: 'Farmer Profile Creation',
    desc: 'A dedicated farmer dashboard will be initialized with imported data.',
    done: false,
  },
  {
    title: 'Subscription Activation',
    desc: 'Selected plan features will unlock immediately upon conversion.',
    done: false,
  },
]

const benefits = ['Precision Weather Alerts', 'Soil Health Tracking']

export default function ConversionPreview() {
  return (
    <div className="rounded-2xl bg-brand-primary p-6 text-white lg:sticky lg:top-8">
      <h3 className="text-lg font-semibold">Conversion Preview</h3>
      <p className="mt-1 text-sm text-white/75">Review outcomes after clicking convert</p>

      <ul className="mt-8 space-y-6">
        {steps.map((step) => (
          <li key={step.title} className="flex gap-3">
            {step.done ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3.5 w-3.5" />
              </span>
            ) : (
              <Circle className="h-6 w-6 shrink-0 text-white/40" strokeWidth={1.5} />
            )}
            <div>
              <p className="text-sm font-semibold">{step.title}</p>
              <p className="mt-0.5 text-xs text-white/70">{step.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-xl bg-white/10 p-4">
        <p className="text-2xl font-bold text-green-300">₹ 1,499/mo</p>
        <ul className="mt-4 space-y-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-400" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-xl">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80"
          alt="Farm"
          className="h-32 w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2">
          <p className="text-xs font-medium text-white">Assigned Region: Nashik Cluster-A</p>
        </div>
      </div>
    </div>
  )
}
