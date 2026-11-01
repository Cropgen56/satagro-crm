import { Check, Mail, MapPin, AlertCircle } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { UserAvatar } from '@/components/ui/EmptyState'

const LEVEL_LABELS = {
  super: 'Super Admin',
  country: 'Country Admin',
  state: 'State Admin',
  district: 'District Operator',
  ground: 'Field Agent',
}

const LAST_INVITE_KEY = 'satagro:lastInvitationSent'

/**
 * Router state is lost on a page refresh, so keep the last confirmation in
 * sessionStorage (this tab only) and fall back to it.
 */
function useInvitationState() {
  const { state } = useLocation()
  return useMemo(() => {
    if (state?.invitation) {
      try {
        sessionStorage.setItem(LAST_INVITE_KEY, JSON.stringify(state))
      } catch {
        /* storage unavailable — page still renders from router state */
      }
      return state
    }
    try {
      return JSON.parse(sessionStorage.getItem(LAST_INVITE_KEY) || 'null')
    } catch {
      return null
    }
  }, [state])
}

export default function InvitationSentContent() {
  const state = useInvitationState()
  const invitation = state?.invitation
  const emailSent = state?.emailSent
  const emailError = state?.emailError
  const upgradedFromFarmer = state?.response?.invitation?.upgradedFromFarmer === true
  const existingAccount = state?.response?.invitation?.existingAccount === true

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
          {existingAccount ? (
            <p className="mx-auto mt-4 max-w-[520px] rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              {upgradedFromFarmer
                ? 'This registered farmer was upgraded to CRM staff on the same account — their farms, history and client credits stay linked.'
                : 'This existing account was given CRM access — no new account was created.'}
            </p>
          ) : null}
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
                  {[
                    invitation.districtName || invitation.districtCode,
                    invitation.stateName || invitation.stateCode,
                    invitation.countryName || invitation.countryCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
