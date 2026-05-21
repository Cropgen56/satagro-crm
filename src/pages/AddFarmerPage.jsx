import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import AddFarmerFooter from '@/components/add-farmer/AddFarmerFooter'
import AddFarmerStepper from '@/components/add-farmer/AddFarmerStepper'
import StepCrop from '@/components/add-farmer/steps/StepCrop'
import StepLocation from '@/components/add-farmer/steps/StepLocation'
import StepPersonal from '@/components/add-farmer/steps/StepPersonal'
import StepReview from '@/components/add-farmer/steps/StepReview'
import StepSubscription from '@/components/add-farmer/steps/StepSubscription'
import { initialFarmerForm } from '@/data/addFarmer'

export default function AddFarmerPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialFarmerForm)

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (step < 5) setStep((s) => s + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const handleSave = () => {
    navigate('/farmers')
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepPersonal form={form} updateForm={updateForm} />
      case 2:
        return <StepLocation form={form} updateForm={updateForm} />
      case 3:
        return <StepCrop form={form} updateForm={updateForm} />
      case 4:
        return <StepSubscription form={form} updateForm={updateForm} />
      case 5:
        return <StepReview form={form} updateForm={updateForm} goToStep={setStep} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Add Farmer</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new farmer record in the central registry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/farmers')}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Save Draft
          </button>
        </div>
      </div>

      <AddFarmerStepper currentStep={step} />

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
        {renderStep()}

        {step < 5 ? (
          <AddFarmerFooter
            onPrevious={handlePrevious}
            onContinue={handleNext}
            showPrevious={step > 1}
          />
        ) : (
          <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Step
            </button>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  handleSave()
                  setForm(initialFarmerForm)
                  setStep(1)
                }}
                className="rounded-lg border border-teal-200 bg-teal-50 px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-100"
              >
                Save & Add Another
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!form.confirmed}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Farmer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
