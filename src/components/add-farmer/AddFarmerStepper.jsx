import clsx from 'clsx'
import { Check } from 'lucide-react'
import { ADD_FARMER_STEPS } from '@/data/addFarmer'

export default function AddFarmerStepper({ currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {ADD_FARMER_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isActive = currentStep === step.id
          const isLast = index === ADD_FARMER_STEPS.length - 1

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={clsx(
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isCompleted && 'bg-green-500 text-white',
                    isActive && !isCompleted && 'bg-brand-primary text-white',
                    !isActive && !isCompleted && 'bg-gray-100 text-gray-400',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step.id}
                </div>
                <span
                  className={clsx(
                    'hidden max-w-[90px] text-center text-[11px] font-medium leading-tight sm:block',
                    isActive || isCompleted ? 'text-brand-primary' : 'text-gray-400',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={clsx(
                    'mx-2 h-0.5 flex-1',
                    isCompleted ? 'bg-green-500' : 'bg-gray-200',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
