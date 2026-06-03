import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { apiRequest } from '@/lib/api'
import { getLoginPhone, clearLoginPhone } from '@/lib/auth'
import { maskPhone } from '@/lib/phone'
import { useAuth } from '@/context/AuthContext'

const OTP_LENGTH = 6

export default function OtpPage() {
  const navigate = useNavigate()
  const { completeLogin } = useAuth()
  const phone = getLoginPhone()
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [countdown, setCountdown] = useState(30)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const verify = async (code) => {
    if (!phone) {
      setError('Session expired. Please sign in again.')
      navigate('/login', { replace: true })
      return
    }

    if (code.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setError('')
    try {
      setLoading(true)
      const response = await apiRequest('/biodrops/whatsapp/verify', {
        method: 'POST',
        body: { phone, otp: code },
      })
      await completeLogin(response)
      clearLoginPhone()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err.code === 'CRM_ACCESS_DENIED') {
        clearLoginPhone()
        navigate('/access-denied', { replace: true })
        return
      }
      setError(err.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    verify(otp.join(''))
  }

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    if (value && index === OTP_LENGTH - 1) {
      const code = next.join('')
      if (code.length === OTP_LENGTH) {
        verify(code)
      }
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    const next = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasted.length; i += 1) {
      next[i] = pasted[i]
    }
    setOtp(next)
    if (pasted.length === OTP_LENGTH) {
      verify(pasted)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    if (!phone || resending) return
    setError('')
    try {
      setResending(true)
      await apiRequest('/biodrops/whatsapp/resend', {
        method: 'POST',
        body: { phone },
      })
      setCountdown(30)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      footer={
        <p className="text-gray-500">
          Didn&apos;t receive the code? Wait for the timer, then tap Resend.
        </p>
      }
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <Link
          to="/login"
          onClick={() => clearLoginPhone()}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Change number
        </Link>

        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>

        <h2 className="text-center text-xl font-bold text-gray-900">Verify OTP</h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Enter the 6-digit code sent to WhatsApp
          {phone ? (
            <>
              <br />
              <span className="font-medium text-gray-700">{maskPhone(phone)}</span>
            </>
          ) : null}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-12 w-10 rounded-lg border border-gray-300 text-center text-lg font-semibold outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600 sm:h-14 sm:w-12"
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            {countdown > 0 ? (
              <span className="inline-flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4" />
                Resend OTP in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                disabled={resending}
                onClick={handleResend}
                className="font-medium text-brand-700 hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending…' : 'Resend code'}
              </button>
            )}
          </div>

          <Button type="submit" disabled={loading} showArrow>
            {loading ? 'Verifying…' : 'Verify & continue'}
          </Button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </div>
    </AuthLayout>
  )
}
