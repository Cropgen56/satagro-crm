import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Mail, ShieldCheck, Loader2 } from 'lucide-react'
import { acceptInvitation, fetchInvitationByToken } from '@/lib/invitation'

export default function AcceptInvitationPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [invitation, setInvitation] = useState(null)
  const [alreadyAccepted, setAlreadyAccepted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await fetchInvitationByToken(token)
        if (!active) return
        setInvitation(res?.invitation || null)
        setAlreadyAccepted(Boolean(res?.alreadyAccepted))
      } catch (err) {
        if (!active) return
        setError(err.message || 'Invalid or expired invitation link')
      } finally {
        if (active) setLoading(false)
      }
    }
    if (token) load()
    return () => {
      active = false
    }
  }, [token])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!acceptTerms) {
      setError('Please accept the terms to continue')
      return
    }
    try {
      setSubmitting(true)
      setError('')
      const res = await acceptInvitation(token, { acceptTerms: true })
      setSuccess(
        res?.message ||
          'Invitation verified. Check your email for login instructions.'
      )
      setAlreadyAccepted(true)
    } catch (err) {
      setError(err.message || 'Verification failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7F6]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7F6] p-6">
      <div className="w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ECF7F3]">
            <Mail className="h-7 w-7 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-brand-primary">
            Satagro CRM Invitation
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Verify your account to receive login instructions by email.
          </p>
        </div>

        {error && !invitation ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}

        {success || alreadyAccepted ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <p className="mt-4 text-sm font-medium text-gray-800">
              {success ||
                'Your invitation is already verified. Check your email for how to sign in.'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Sign in with your mobile number and WhatsApp OTP.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Go to CRM login
            </Link>
          </div>
        ) : invitation ? (
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="rounded-xl bg-[#F6F8F7] p-4 text-sm">
              <p className="font-semibold text-gray-900">{invitation.name}</p>
              <p className="mt-1 text-gray-600">{invitation.email}</p>
              <p className="mt-2 text-brand-primary font-medium">
                Role: {invitation.roleLabel}
              </p>
              {invitation.phone ? (
                <p className="mt-1 text-gray-500">Phone: {invitation.phone}</p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E7EB] p-4">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-primary"
              />
              <span className="text-sm text-gray-700">
                I accept the terms of use and confirm that I am joining Satagro CRM
                for authorized organizational work.
              </span>
            </label>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {submitting ? 'Verifying...' : 'Verify invitation'}
            </button>
          </form>
        ) : null}

        <p className="mt-6 text-center text-xs text-gray-400">
          Already verified?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-brand-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
