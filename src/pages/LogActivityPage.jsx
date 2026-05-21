import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Save } from 'lucide-react'
import PageTopBar from '@/components/layout/PageTopBar'
import ActivityTypeSelector from '@/components/activities/ActivityTypeSelector'
import FieldLabel, { FieldBox } from '@/components/activities/FieldLabel'
import LogActivitySidebar from '@/components/activities/LogActivitySidebar'
import {
  initialLogActivityForm,
  logActivityAgents,
  logActivityFarmers,
  priorityLevels,
} from '@/data/activities'

export default function LogActivityPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialLogActivityForm)
  const farmer = logActivityFarmers.find((f) => f.id === form.farmer) || logActivityFarmers[0]
  const agent = logActivityAgents.find((a) => a.id === form.assignedAgent) || logActivityAgents[0]

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="min-h-full pb-28">
      <div className="p-6 lg:p-8">
        <PageTopBar />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Log Activity</h1>
            <p className="mt-1 text-sm text-gray-500">Create and schedule a new operational activity</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-brand-light px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-teal-100"
            >
              Save Draft
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <ActivityTypeSelector value={form.activityType} onChange={(v) => update('activityType', v)} />

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
              <div className="space-y-6">
                <FieldBox>
                  <FieldLabel>Linked Farmer</FieldLabel>
                  <input
                    type="text"
                    readOnly
                    value={`${farmer.name} (ID: ${farmer.displayId})`}
                    className="w-full border-0 bg-transparent py-2 text-sm font-medium text-gray-900 outline-none"
                  />
                  <p className="text-xs text-gray-500">Village: {farmer.village}</p>
                </FieldBox>

                <FieldBox>
                  <FieldLabel>Assigned Agent</FieldLabel>
                  <div className="flex items-center gap-3 py-2">
                    <img src={agent.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                  </div>
                </FieldBox>

                <div className="grid gap-6 md:grid-cols-3">
                  <FieldBox>
                    <FieldLabel>Activity Date</FieldLabel>
                    <div className="relative">
                      <Calendar className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update('date', e.target.value)}
                        className="w-full border-0 bg-transparent py-2 pl-7 text-sm outline-none"
                      />
                    </div>
                  </FieldBox>
                  <FieldBox>
                    <FieldLabel>Start Time</FieldLabel>
                    <div className="relative">
                      <Clock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => update('startTime', e.target.value)}
                        className="w-full border-0 bg-transparent py-2 pl-7 text-sm outline-none"
                      />
                    </div>
                  </FieldBox>
                  <FieldBox>
                    <FieldLabel>End Time</FieldLabel>
                    <div className="relative">
                      <Clock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => update('endTime', e.target.value)}
                        className="w-full border-0 bg-transparent py-2 pl-7 text-sm outline-none"
                      />
                    </div>
                  </FieldBox>
                </div>

                <div>
                  <FieldLabel>Priority Level</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {priorityLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => update('priority', level)}
                        className={`rounded-lg border-2 px-6 py-2 text-sm font-medium ${
                          form.priority === level
                            ? 'border-brand-primary bg-brand-light text-brand-primary'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <FieldBox>
                  <FieldLabel>Current Status</FieldLabel>
                  <input
                    type="text"
                    readOnly
                    value={form.status}
                    className="w-full border-0 bg-transparent py-2 text-sm text-gray-900 outline-none"
                  />
                </FieldBox>

                <FieldBox>
                  <FieldLabel>Instructions & Remarks</FieldLabel>
                  <textarea
                    placeholder="Enter detailed operational notes here..."
                    value={form.instructions}
                    onChange={(e) => update('instructions', e.target.value)}
                    className="min-h-[120px] w-full resize-y border-0 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400"
                  />
                </FieldBox>
              </div>
            </div>
          </div>

          <LogActivitySidebar farmer={farmer} />
        </div>
      </div>

      <footer className="fixed bottom-0 left-[260px] right-0 z-10 border-t border-gray-200 bg-white px-6 py-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/activities')}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg border-2 border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary hover:bg-brand-light"
          >
            Save & Add Another
          </button>
          <button
            type="button"
            onClick={() => navigate('/activities')}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
          >
            <Save className="h-4 w-4" />
            Save Activity
          </button>
        </div>
      </footer>
    </div>
  )
}
