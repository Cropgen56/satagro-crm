import { ArrowLeft, ArrowRight, Info } from 'lucide-react'

export default function AddFarmerFooter({
  onPrevious,
  onContinue,
  continueLabel = 'Continue',
  showPrevious = true,
  children,
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-sm text-gray-500">
        <Info className="h-4 w-4 shrink-0 text-gray-400" />
        Data is automatically saved as you type.
      </p>
      <div className="flex items-center gap-3">
        {showPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
        )}
        {children || (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
          >
            {continueLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
