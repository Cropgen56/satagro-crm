import { Check, Mail, MapPin, AlertCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { UserAvatar } from '@/components/ui/EmptyState'

const LEVEL_LABELS = {
  super: 'Super Admin',
  country: 'Country Admin',
  state: 'State Admin',
  district: 'District Operator',
  ground: 'Field Agent',
}

export default function InvitationSentContent() {
  const { state } = useLocation()
  const invitation = state?.invitation
  const emailSent = state?.emailSent
  const emailError = state?.emailError

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
            {emailSent ? 'Verification email sent' : 'Invitation created'}
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#4B5563]">
            {emailSent ? (
              <>
                We sent an email to <strong>{invitation?.email}</strong> with a link to
                verify their invitation. After verification, they will receive a second
                email explaining how to sign in to Satagro CRM with WhatsApp OTP.
              </>
            ) : emailError ? (
              <>
                The user was created but the email could not be sent: {emailError}. Use
                Pending Invitations to resend.
              </>
            ) : (
              <>
                The admin assignment has been saved. Enable &quot;Send Email Invitation&quot;
                to email a verification link automatically.
              </>
            )}
          </p>
          {emailSent ? (
            <p className="mx-auto mt-3 flex max-w-[520px] items-center justify-center gap-2 text-sm text-brand-primary">
              <Mail className="h-4 w-4" />
              Waiting for invitee to complete verification
            </p>
          ) : null}
          {emailError ? (
            <p className="mx-auto mt-3 flex max-w-[520px] items-center justify-center gap-2 text-sm text-amber-700">
              <AlertCircle className="h-4 w-4" />
              {emailError}
            </p>
          ) : null}
        </div>
      </div>

      {invitation ? (
        <div className="border-t border-[#EEF2F0] px-7 py-8">
          <div className="rounded-[22px] bg-[#F8FAF9] p-6">
            <div className="flex flex-wrap items-start gap-5">
              <UserAvatar name={invitation.fullName} className="h-16 w-16 rounded-2xl text-lg" />
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">FULL NAME</p>
                  <p className="mt-1 text-[16px] font-semibold text-brand-primary">
                    {invitation.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">ROLE</p>
                  <p className="mt-1 text-[16px] font-semibold text-brand-primary">
                    {LEVEL_LABELS[invitation.level] || invitation.level}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">EMAIL</p>
                  <p className="mt-1 text-[15px] text-[#374151]">
                    {invitation.email || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">PHONE</p>
                  <p className="mt-1 text-[15px] text-[#374151]">
                    {invitation.phone || '—'}
                  </p>
                </div>
              </div>
            </div>

            {(invitation.countryCode || invitation.stateCode || invitation.districtCode) && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-primary" />
                  <h4 className="text-[15px] font-semibold text-brand-primary">Region</h4>
                </div>
                <p className="mt-2 text-sm text-[#374151]">
                  {[invitation.countryCode, invitation.stateCode, invitation.districtCode]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
