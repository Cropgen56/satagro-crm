import clsx from 'clsx'
import { FARMER_TABS } from '@/lib/moduleConstants'

export default function FarmerDetailTabs({ activeTab, onTabChange, tabs = FARMER_TABS }) {
  return (
    <nav className="-mb-px flex min-w-0 gap-6 overflow-x-auto" role="tablist">
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3.5 pt-2 text-sm font-medium transition-colors',
              active
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            )}
          >
            {tab.label}
            {tab.count != null ? (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none',
                  active ? 'bg-brand-light text-brand-primary' : 'bg-gray-100 text-gray-500',
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}
