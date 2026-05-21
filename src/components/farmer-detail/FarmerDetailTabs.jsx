import clsx from 'clsx'
import { FARMER_TABS } from '@/data/farmerDetail'

export default function FarmerDetailTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-8 overflow-x-auto pb-1">
        {FARMER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'shrink-0 border-b-2 px-1 pb-4 pt-1 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
