import { useNavigate } from 'react-router-dom'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { logoutRequest } from '@/lib/api'

export default function AccessDeniedPage() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await logoutRequest()
    navigate('/login', { replace: true })
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <Logo size="md" className="mx-auto" />
        <h2 className="mt-6 text-xl font-bold text-gray-900">Access not granted</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Your account signed in successfully, but it does not have SatAgro CRM admin
          permissions. Contact your organization administrator to assign a CRM role.
        </p>
        <div className="mt-8 space-y-3">
          <Button type="button" onClick={handleSignOut}>
            Sign out
          </Button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="block w-full text-sm text-brand-700 hover:underline"
          >
            Try a different number
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
