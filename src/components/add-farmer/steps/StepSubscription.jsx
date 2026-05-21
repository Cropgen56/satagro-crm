import { ChevronDown, FileText, Tag, UserPlus } from 'lucide-react'
import clsx from 'clsx'
import FormSection from '../FormSection'
import { fieldAgents, subscriptionPlans } from '@/data/addFarmer'

export default function StepSubscription({ form, updateForm }) {
  const selectedAgent = fieldAgents.find((a) => a.id === form.assignedAgent) || fieldAgents[0]

  return (
    <div className="space-y-8">
      <FormSection icon={UserPlus} title="Assigned Agent">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Select Field Agent</label>
          <div className="relative">
            <select
              value={form.assignedAgent}
              onChange={(e) => updateForm('assignedAgent', e.target.value)}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
            >
              {fieldAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
              <img
                src={selectedAgent.avatar}
                alt={selectedAgent.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{selectedAgent.name}</p>
                <p className="text-xs text-gray-500">{selectedAgent.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            This agent will be responsible for field visits and data verification.
          </p>
        </div>
      </FormSection>

      <FormSection icon={Tag} title="Subscription Plan">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {subscriptionPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => updateForm('plan', plan.id)}
              className={clsx(
                'relative flex flex-col rounded-xl border-2 p-4 text-left transition-colors',
                form.plan === plan.id
                  ? 'border-brand-primary bg-brand-light/20'
                  : 'border-gray-100 bg-white hover:border-gray-200',
              )}
            >
              {plan.popular && (
                <span className="absolute -right-px -top-px rounded-bl-lg rounded-tr-lg bg-brand-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Popular
                </span>
              )}
              <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
              <p className="mt-1">
                <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-xs text-gray-500">{plan.period}</span>
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {plan.badge}
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-gray-600">
                    • {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection icon={FileText} title="Internal Notes">
        <textarea
          value={form.internalNotes}
          onChange={(e) => updateForm('internalNotes', e.target.value)}
          placeholder="Add any specific observations, historical yield notes, or agent comments here..."
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
        />
      </FormSection>
    </div>
  )
}
