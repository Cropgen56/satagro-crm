import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Search } from 'lucide-react'
import PageTopBar from '@/components/layout/PageTopBar'
import CreateTaskSidebar from '@/components/tasks/CreateTaskSidebar'
import TaskTypeSelector from '@/components/tasks/TaskTypeSelector'
import {
  assignableUsers,
  createTaskFarmer,
  initialCreateTaskForm,
  priorityLevels,
  taskStatuses,
} from '@/data/tasks'

export default function CreateTaskPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialCreateTaskForm)
  const agent = assignableUsers.find((u) => u.id === form.assignedUser) || assignableUsers[0]

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="min-h-full pb-28">
      <div className="p-6 lg:p-8">
        <PageTopBar />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">Create Task</h1>
            <p className="mt-1 text-sm text-gray-500">Assign and schedule a new operational task.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Save Draft
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
              <TaskTypeSelector value={form.taskType} onChange={(v) => update('taskType', v)} />

              <div className="mt-8 space-y-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Related Farmer
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, ID or village"
                        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Assigned User
                    </label>
                    <select
                      value={form.assignedUser}
                      onChange={(e) => update('assignedUser', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    >
                      {assignableUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                      <img src={agent.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                      <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-600">Priority Level</label>
                  <div className="flex flex-wrap gap-2">
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

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => update('status', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    >
                      {taskStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Due Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={form.dueDateTime}
                      onChange={(e) => update('dueDateTime', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Description / Notes
                  </label>
                  <textarea
                    placeholder="Enter task description and operational notes..."
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    className="min-h-[120px] w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <CreateTaskSidebar farmer={createTaskFarmer} />
        </div>
      </div>

      <footer className="fixed bottom-0 left-[260px] right-0 z-10 border-t border-gray-200 bg-white px-6 py-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border-2 border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary hover:bg-brand-light"
            >
              Create & Add Another
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"
            >
              <Check className="h-4 w-4" />
              Create Task
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
