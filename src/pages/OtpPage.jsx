import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, HelpCircle, Shield, Lock } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'

const OTP_LENGTH = 6

export default function OtpPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [countdown, setCountdown] = useState(30)
  const inputRefs = useRef([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      footer={
        <div className="flex items-center justify-center gap-6 text-gray-400">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            SECURE SHELL
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            256-BIT ENCRYPTED
          </span>
        </div>
      }
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>

        <h2 className="text-center text-xl font-bold text-gray-900">Verify OTP</h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Enter the 6-digit code sent to your phone
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
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
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Resend OTP in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setCountdown(30)}
                className="font-medium text-brand-700 hover:underline"
              >
                Resend Code
              </button>
            )}
          </div>

          <Button type="submit" showArrow>
            Verify & Continue
          </Button>
        </form>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-brand-700"
        >
          <HelpCircle className="h-4 w-4" />
          Having trouble? Contact Support
        </button>
      </div>
    </AuthLayout>
  )
}
