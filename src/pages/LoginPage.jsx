import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Mail, Phone } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { apiRequest } from '@/lib/api'
import { setLoginEmail, setLoginPhone } from '@/lib/auth'
import { isValidIndianMobile, normalizeIndianPhone } from '@/lib/phone'

const LOGIN_METHODS = [
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'email', label: 'Email', icon: Mail },
]

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (method === 'phone') {
      if (!isValidIndianMobile(phone)) {
        setError('Enter a valid 10-digit Indian mobile number')
        return
      }

      const e164 = normalizeIndianPhone(phone)

      try {
        setLoading(true)
        await apiRequest('/biodrops/whatsapp/otp', {
          method: 'POST',
          body: { phone: e164 },
        })
        setLoginPhone(e164)
        navigate('/otp')
      } catch (err) {
        setError(err.message || 'Failed to send OTP')
      } finally {
        setLoading(false)
      }
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!isValidEmail(normalizedEmail)) {
      setError('Enter a valid email address')
      return
    }

    try {
      setLoading(true)
      await apiRequest('/biodrops/login/otp', {
        method: 'POST',
        body: { email: normalizedEmail },
      })
      setLoginEmail(normalizedEmail)
      navigate('/otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      footer={
        <p className="text-gray-500">
          {method === 'phone'
            ? 'OTP is sent to your WhatsApp number registered with SatAgro.'
            : 'OTP is sent to your registered email address.'}
        </p>
      }
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Logo size="md" className="mx-auto object-center" />
        </div>

        <h2 className="text-center text-xl font-bold text-gray-900">
          Sign in to SatAgro CRM
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Choose phone or email to receive your OTP
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
          {LOGIN_METHODS.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setMethod(option.id)
                  setError('')
                }}
                className={clsx(
                  'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  method === option.id
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {method === 'phone' ? (
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-brand-600">
                <div className="flex items-center gap-1.5 border-r border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-700">
                  <span className="text-base">🇮🇳</span>
                  <span className="font-medium">+91</span>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile"
                    className="w-full py-3 pl-10 pr-3 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600"
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} showArrow>
            {loading
              ? 'Sending OTP…'
              : method === 'phone'
                ? 'Send OTP on WhatsApp'
                : 'Send OTP to Email'}
          </Button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </div>
    </AuthLayout>
  )
}
