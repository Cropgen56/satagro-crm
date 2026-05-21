import clsx from 'clsx'
import {
  CreditCard,
  Eye,
  FileText,
  Phone,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { taskTypes } from '@/data/tasks'

const icons = {
  eye: Eye,
  file: FileText,
  refresh: RefreshCw,
  credit: CreditCard,
  phone: Phone,
  plus: Plus,
}

export default function TaskTypeSelector({ value, onChange }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        Select Task Type
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {taskTypes.map((type) => {
          const Icon = icons[type.icon] || Plus
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
              <span
                className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  selected ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400',
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={clsx(
                  'text-center text-xs font-medium leading-tight',
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
