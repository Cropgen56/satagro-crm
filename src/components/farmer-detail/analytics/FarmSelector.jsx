import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Check, ChevronDown, Tractor } from 'lucide-react'
import { formatFieldCrops, hasBoundary } from '@/lib/farmAnalytics'

function SubscriptionDot({ field }) {
  const active = Boolean(field.subscription?.hasActiveSubscription)
  return (
    <span
      className={clsx('h-2 w-2 shrink-0 rounded-full', active ? 'bg-green-500' : 'bg-red-400')}
      title={active ? 'Active subscription' : 'No active subscription'}
    />
  )
}

export default function FarmSelector({ fields, selectedField, onSelect }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!selectedField) return null

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left hover:border-brand-primary sm:min-w-[280px]"
      >
        <Tractor className="h-4 w-4 shrink-0 text-brand-primary" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Viewing farm {fields.length > 1 ? `(${fields.length} farms)` : ''}
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <SubscriptionDot field={selectedField} />
            <span className="truncate">{selectedField.fieldName || 'Unnamed farm'}</span>
          </span>
        </span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 text-gray-400 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-[1100] mt-2 max-h-80 w-full min-w-[300px] overflow-y-auto rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
        >
          {fields.map((field) => {
            const selected = field._id === selectedField._id
            const acre = Number(field.acre)
            return (
              <li key={field._id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(field._id)
                    setOpen(false)
                  }}
                  className={clsx(
                    'flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-gray-50',
                    selected && 'bg-brand-light/60',
                  )}
                >
                  <span className="mt-1.5">
                    <SubscriptionDot field={field} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-900">
                      {field.fieldName || 'Unnamed farm'}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      {formatFieldCrops(field)}
                      {acre > 0 ? ` · ${acre.toFixed(2)} ac` : ''}
                      {hasBoundary(field) ? '' : ' · no boundary'}
                    </span>
                  </span>
                  {selected ? <Check className="mt-1 h-4 w-4 shrink-0 text-brand-primary" /> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
