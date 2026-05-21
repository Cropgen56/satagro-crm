import { Leaf, X } from 'lucide-react'
import clsx from 'clsx'
import FormSection from '../FormSection'
import { cropOptions, cropStages, seasons, secondaryCropOptions } from '@/data/addFarmer'

export default function StepCrop({ form, updateForm }) {
  const toggleSecondary = (crop) => {
    const current = form.secondaryCrops || []
    if (current.includes(crop)) {
      updateForm(
        'secondaryCrops',
        current.filter((c) => c !== crop),
      )
    } else {
      updateForm('secondaryCrops', [...current, crop])
    }
  }

  const removeSecondary = (crop) => {
    updateForm(
      'secondaryCrops',
      (form.secondaryCrops || []).filter((c) => c !== crop),
    )
  }

  return (
    <div className="space-y-8">
      <FormSection icon={Leaf} title="Primary Crop">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {cropOptions.map((crop) => (
            <button
              key={crop.id}
              type="button"
              onClick={() => updateForm('primaryCrop', crop.id)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
                form.primaryCrop === crop.id
                  ? 'border-brand-primary bg-brand-light/30'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200',
              )}
            >
              <span className="text-3xl">{crop.emoji}</span>
              <span className="text-sm font-medium text-gray-800">{crop.label}</span>
            </button>
          ))}
        </div>
      </FormSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Secondary Crops <span className="font-normal text-gray-400">(Optional)</span>
          </label>
          <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white p-2">
            <div className="flex flex-wrap gap-2">
              {(form.secondaryCrops || []).map((crop) => (
                <span
                  key={crop}
                  className="inline-flex items-center gap-1 rounded-md bg-brand-light px-2 py-1 text-xs font-medium text-brand-primary"
                >
                  {crop}
                  <button type="button" onClick={() => removeSecondary(crop)} aria-label={`Remove ${crop}`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) toggleSecondary(e.target.value)
              }}
              className="mt-1 w-full border-0 bg-transparent text-sm text-gray-400 outline-none"
            >
              <option value="">Add more...</option>
              {secondaryCropOptions
                .filter((c) => !(form.secondaryCrops || []).includes(c))
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Crop Season</label>
          <div className="flex rounded-lg border border-gray-200 p-0.5">
            {seasons.map((season) => (
              <button
                key={season}
                type="button"
                onClick={() => updateForm('season', season)}
                className={clsx(
                  'flex-1 rounded-md py-2.5 text-sm font-medium transition-colors',
                  form.season === season
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-500 hover:text-gray-700',
                )}
              >
                {season}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">Current Crop Stage</label>
        <div className="flex rounded-xl bg-gray-100 p-1">
          {cropStages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => updateForm('cropStage', stage.id)}
              className={clsx(
                'flex flex-1 flex-col items-center gap-1 rounded-lg py-3 text-xs font-medium transition-all sm:text-sm',
                form.cropStage === stage.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              <span className="text-lg">{stage.icon}</span>
              {stage.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
