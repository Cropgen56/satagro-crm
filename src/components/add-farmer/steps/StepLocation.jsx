import { MapPin, Mountain } from 'lucide-react'
import clsx from 'clsx'
import FormSection from '../FormSection'
import { districts, irrigationTypes, states, villages } from '@/lib/moduleConstants'

const selectClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'

export default function StepLocation({ form, updateForm }) {
  return (
    <div className="space-y-8">
      <FormSection icon={MapPin} title="Geographic Location">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">State</label>
            <select
              value={form.state}
              onChange={(e) => updateForm('state', e.target.value)}
              className={selectClass}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">District</label>
            <select
              value={form.district}
              onChange={(e) => updateForm('district', e.target.value)}
              className={selectClass}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Village</label>
            <select
              value={form.village}
              onChange={(e) => updateForm('village', e.target.value)}
              className={selectClass}
            >
              <option value="">Select Village</option>
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Address Details</label>
          <textarea
            value={form.address}
            onChange={(e) => updateForm('address', e.target.value)}
            placeholder="Enter house number, street, or landmark..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
      </FormSection>

      <FormSection icon={Mountain} title="Land & Irrigation">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Total Land Size</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={form.landSize}
                onChange={(e) => updateForm('landSize', e.target.value)}
                placeholder="0"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
              <div className="flex rounded-lg border border-gray-200 p-0.5">
                {['acres', 'hectares'].map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => updateForm('landUnit', unit)}
                    className={clsx(
                      'rounded-md px-3 py-2 text-xs font-medium capitalize transition-colors',
                      form.landUnit === unit
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-500 hover:text-gray-700',
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Irrigation Type</label>
            <select
              value={form.irrigation}
              onChange={(e) => updateForm('irrigation', e.target.value)}
              className={selectClass}
            >
              <option value="">Select Option</option>
              {irrigationTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            alt="Farm field"
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <p className="text-sm font-medium text-white">
              Verify land details using satellite imagery (optional)
            </p>
          </div>
        </div>
      </FormSection>
    </div>
  )
}
