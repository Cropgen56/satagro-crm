// components/usermanagement/sendinginvitation/InvitationSentContent.jsx

import {
  Check,
  BadgeCheck,
  UserPlus,
  Download,
  Shield,
  MapPin,
  Star,
} from 'lucide-react'

export default function InvitationSentContent() {
  const steps = [
    'Invitation Created',
    'Email Sent',
    'SMS Sent',
    'User Registration',
    'Account Activation',
  ]

  return (
    <>
      <div className="border-t border-[#EEF2F0] px-7 py-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF2F0]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary">
            <Check className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-[18px] font-semibold text-brand-primary">
            Invitation Sent Successfully
          </h2>

          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#4B5563]">
            The user will receive onboarding instructions via email and SMS shortly.
          </p>
        </div>
      </div>

      <div className="border-y border-[#EEF2F0] px-10 py-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    index < 3
                      ? 'bg-brand-primary text-white'
                      : 'bg-[#EEF2F0] text-[#9CA3AF]'
                  }`}
                >
                  {index < 3 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                <p
                  className={`mt-3 text-center text-[13px] font-medium ${
                    index < 3
                      ? 'text-brand-primary'
                      : 'text-[#7B848E]'
                  }`}
                >
                  {step}
                </p>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`mx-4 h-[2px] flex-1 ${
                    index < 2
                      ? 'bg-brand-primary'
                      : 'bg-[#D9DEDB]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-7 py-8">
        <div className="rounded-[22px] bg-[#F8FAF9] p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
            <div className="flex items-center gap-5">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
                alt=""
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">
                  FULL NAME
                </p>

                <h3 className="mt-2 text-[16px] font-semibold text-brand-primary">
                  Alex Rivers
                </h3>

                <p className="mt-4 text-[11px] font-bold tracking-wide text-[#6B7280]">
                  EMAIL ADDRESS
                </p>

                <p className="mt-1 text-[15px] text-[#374151]">
                  alex.rivers@cropgen.com
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">
                ASSIGNED ROLE
              </p>

              <div className="mt-3 inline-flex rounded-full border border-[#A7D6C8] bg-[#EAF7F2] px-4 py-2 text-[13px] font-semibold text-brand-primary">
                State Admin
              </div>

              <p className="mt-5 text-[11px] font-bold tracking-wide text-[#6B7280]">
                PHONE NUMBER
              </p>

              <p className="mt-1 text-[15px] text-[#374151]">
                +91 98230 44556
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">
                REPORTING MANAGER
              </p>

              <p className="mt-2 text-[16px] font-semibold text-brand-primary">
                Marcus Thorne
              </p>

              <p className="mt-5 text-[11px] font-bold tracking-wide text-[#6B7280]">
                INVITED AT
              </p>

              <p className="mt-1 text-[15px] text-[#374151]">
                Oct 24, 2023 • 14:32 PM
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-primary" />

                <h4 className="text-[15px] font-semibold text-brand-primary">
                  Regional Access
                </h4>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {['Maharashtra', 'Pune District'].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#C9D1CD] px-5 py-3 text-[14px] text-[#374151]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-brand-primary" />

                <h4 className="text-[15px] font-semibold text-brand-primary">
                  Enabled Modules
                </h4>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {['Farmers', 'Activities', 'Tasks', 'Reports'].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#B9DCD2] bg-[#EEF8F4] px-5 py-3 text-[14px] font-semibold text-brand-primary"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {[
              {
                title: 'View Pending',
                desc: 'Manage all active invitations',
                icon: BadgeCheck,
              },
              {
                title: 'Invite Another',
                desc: 'Create a new user profile',
                icon: UserPlus,
              },
              {
                title: 'Download Summary',
                desc: 'Save access PDF receipt',
                icon: Download,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-[#E5E7EB] bg-white p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2F0]">
                  <item.icon className="h-5 w-5 text-[#5B646F]" />
                </div>

                <h3 className="mt-6 text-[16px] font-semibold text-brand-primary">
                  {item.title}
                </h3>

                <p className="mt-2 text-[14px] text-[#6B7280]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}