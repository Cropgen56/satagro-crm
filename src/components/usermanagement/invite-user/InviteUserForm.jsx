import clsx from 'clsx'
import {
  User2,
  BriefcaseBusiness,
  Network,
  BellRing,
  Info,
  Check,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

const roles = [
  {
    title: 'Super Admin',
    desc: 'Full organizational control and management.',
  },
  {
    title: 'Country Admin',
    desc: 'Regional oversight for a specific nation.',
  },
  {
    title: 'State User',
    desc: 'State-level monitoring and data entry.',
  },
  {
    title: 'District Operator',
    desc: 'On-field management of farmer clusters.',
    active: true,
  },
  {
    title: 'FPO / Agent',
    desc: 'Frontline contact for farmer organizations.',
  },
]

const permissions = [
  {
    label: 'Create Farmer Records',
    allowed: true,
  },
  {
    label: 'Update Crop Life Cycle',
    allowed: true,
  },
  {
    label: 'Access District Reports',
    allowed: true,
  },
  {
    label: 'Delete Organization Data',
    allowed: false,
  },
]

export default function InviteUserForm() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_0.8fr]">
      <div className="rounded-[22px] border border-[#E3E8E6] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-brand-primary" />

          <h2 className="text-[17px] font-semibold text-[#202939]">
            Basic Information
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Full Name
            </label>

            <input
              placeholder="e.g. John Doe"
              className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Email Address
            </label>

            <input
              placeholder="john.doe@enterprise.com"
              className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[12px] font-medium text-[#374151]">
            Mobile Number
          </label>

          <div className="flex gap-3">
            <div className="flex h-11 w-[95px] items-center justify-between rounded-xl border border-[#CBD5D1] px-4">
              <span className="text-[13px] text-[#111827]">+1</span>

              <ChevronDown className="h-4 w-4 text-[#6B7280]" />
            </div>

            <input
              placeholder="Phone number"
              className="h-11 flex-1 rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-brand-primary" />

          <h2 className="text-[17px] font-semibold text-[#202939]">
            Select User Role
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {roles.map((role) => (
            <button
              key={role.title}
              className={clsx(
                'relative rounded-2xl border p-4 text-left transition',
                role.active
                  ? 'border-brand-primary bg-[#ECF7F3]'
                  : 'border-[#CBD5D1] bg-white hover:border-brand-primary'
              )}
            >
              {role.active && (
                <div className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}

              <p
                className={clsx(
                  'text-[14px] font-semibold',
                  role.active
                    ? 'text-brand-primary'
                    : 'text-[#1F2937]'
                )}
              >
                {role.title}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">
                {role.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2">
          <Network className="h-4 w-4 text-brand-primary" />

          <h2 className="text-[17px] font-semibold text-[#202939]">
            Reporting Hierarchy
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Reports To
            </label>

            <input
              placeholder="Search for manager..."
              className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#374151]">
              Parent Admin
            </label>

            <input
              placeholder="Select parent unit..."
              className="h-11 w-full rounded-xl border border-[#CBD5D1] bg-white px-4 text-[13px] outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <BellRing className="h-4 w-4 text-brand-primary" />

          <h2 className="text-[17px] font-semibold text-[#202939]">
            Invitation Preferences
          </h2>
        </div>

        <div className="mt-5 space-y-3">
          {[
            {
              label: 'Send Email Invitation',
              active: true,
            },
            {
              label: 'Send SMS Invitation',
              active: false,
            },
            {
              label: 'Force Password Reset on First Login',
              active: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-[#CBD5D1] px-5 py-3"
            >
              <p className="text-[14px] text-[#202939]">
                {item.label}
              </p>

              <div
                className={clsx(
                  'flex h-6 w-11 items-center rounded-full px-1 transition',
                  item.active
                    ? 'justify-end bg-brand-primary'
                    : 'justify-start bg-[#D1D8D5]'
                )}
              >
                <div className="h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[22px] border border-[#E3E8E6] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-brand-primary" />

            <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#4B5563]">
              Role Summary
            </h3>
          </div>

          <h2 className="mt-5 text-[17px] font-semibold text-brand-primary">
            District Operator
          </h2>

          <p className="mt-3 text-[13px] leading-6 text-[#4B5563]">
            District Operators can manage farmers within assigned districts.
            They have permissions to view yield forecasts, register new crops,
            and manage distribution centers.
          </p>

          <div className="my-5 border-t border-[#E5E7EB]" />

          <h4 className="text-[13px] font-semibold text-[#1F2937]">
            Core Permissions:
          </h4>

          <div className="mt-4 space-y-3">
            {permissions.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3"
              >
                {item.allowed ? (
                  <Check className="h-4 w-4 text-[#059669]" />
                ) : (
                  <X className="h-4 w-4 text-[#DC2626]" />
                )}

                <span className="text-[13px] text-[#4B5563]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[22px]">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
            alt=""
            className="h-[200px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#003B34]/50" />

          <div className="absolute bottom-5 left-5 max-w-[220px]">
            <p className="text-[17px] leading-7 text-white">
              “Empowering regional teams with precision data tools.”
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate('/role-assignment')}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-brand-950"
          >
            Continue to Role Assignment
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}