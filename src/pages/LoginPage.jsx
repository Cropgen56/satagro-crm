import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, Phone } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'

export default function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/otp')
  }

  return (
    <AuthLayout
      footer={
        <p>
          <a href="#" className="hover:text-brand-primary">
            Terms of Service
          </a>
          {' · '}
          <a href="#" className="hover:text-brand-primary">
            Privacy Policy
          </a>
        </p>
      }
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Logo size="md" className="mx-auto object-center" />
        </div>

        <h2 className="text-center text-xl font-bold text-gray-900">Log in to your account</h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Enter your mobile number to receive OTP
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full py-3 pl-10 pr-3 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <Button type="submit" showArrow>
            Send OTP
          </Button>
        </form>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-brand-700"
        >
          <HelpCircle className="h-4 w-4" />
          Need help?
        </button>
      </div>
    </AuthLayout>
  )
}
