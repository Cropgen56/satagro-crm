// components/usermanagement/pendinginvitation/PendingInvitationProfile.jsx

import {
  Mail,
  Phone,
  Clock,
  Check,
  UserPlus,
  ShieldCheck,
} from 'lucide-react'

export default function PendingInvitationProfile() {
  const steps = [
    {
      label: 'Invitation Created',
      active: true,
      icon: Check,
    },
    {
      label: 'Email Delivered',
      active: true,
      icon: Check,
    },
    {
      label: 'SMS Delivered',
      active: true,
      icon: Check,
    },
    {
      label: 'Invitation Opened',
      active: true,
      icon: Check,
    },
    {
      label: 'Registration Pending',
      active: false,
      icon: UserPlus,
    },
    {
      label: 'KYC Pending',
      active: false,
      icon: ShieldCheck,
    },
    {
      label: 'Activation Pending',
      active: false,
      icon: Check,
    },
  ]

  return (
    <>
      <div className="mt-8 rounded-[26px] border border-[#EEF1EF] bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-7">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
                alt=""
                className="h-[86px] w-[86px] rounded-2xl object-cover"
              />

              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#F59E0B] text-white">
                <span className="text-xs">••</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[22px] font-semibold text-[#202939]">
                  Alex Rivers
                </h2>

                <span className="rounded-full bg-[#9FE7D7] px-4 py-1 text-[11px] font-semibold text-brand-primary">
                  State Admin
                </span>

                <span className="rounded-full bg-[#FEF3C7] px-4 py-1 text-[11px] font-semibold text-[#B45309]">
                  Pending
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-7 text-[14px] text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  alex.rivers@cropgen.com
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 98230 44556
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[14px] text-[#4B5563]">
              Sent: Oct 24, 2023 • 14:32 PM
            </p>

            <p className="mt-3 flex items-center justify-end gap-2 text-[14px] font-semibold text-[#DC2626]">
              <Clock className="h-4 w-4" />
              Expires in: 45h 28m
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[26px] border border-[#EEF1EF] bg-white px-10 py-8 shadow-sm">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.label}
                className="flex flex-1 items-start last:flex-none"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-4 ${
                      step.active
                        ? 'border-[#D8EEE7] bg-brand-primary text-white'
                        : 'border-[#F0F3F1] bg-[#E9EFEC] text-[#6B7280]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <p
                    className={`mt-3 max-w-[90px] text-center text-[13px] font-semibold leading-5 ${
                      step.active ? 'text-brand-primary' : 'text-[#6B7280]'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`mx-2 mt-5 h-[2px] flex-1 ${
                      index < 3 ? 'bg-brand-primary/60' : 'bg-[#D9DEDB]'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}