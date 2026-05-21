import clsx from 'clsx'
import { Leaf, Phone, RefreshCw, Tractor, Users } from 'lucide-react'
import { activityTypes } from '@/data/activities'

const icons = {
  tractor: Tractor,
  phone: Phone,
  users: Users,
  refresh: RefreshCw,
  leaf: Leaf,
}

export default function ActivityTypeSelector({ value, onChange }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        Select Activity Type
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {activityTypes.map((type) => {
          const Icon = icons[type.icon] || Tractor
          const selected = value === type.id
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
                selected
                  ? 'border-brand-primary bg-brand-light'
                  : 'border-gray-200 bg-white hover:border-gray-300',
              )}
            >
              <Icon
                className={clsx('h-6 w-6', selected ? 'text-brand-primary' : 'text-gray-400')}
              />
              <span
                className={clsx(
                  'text-sm font-medium',
                  selected ? 'text-brand-primary' : 'text-gray-600',
                )}
              >
                {type.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
