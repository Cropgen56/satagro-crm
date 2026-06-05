import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getLoginPhone } from '@/lib/auth'

export function LoginGuestRoute() {
  const { loading, isAuthenticated, canAccessCrm } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }

  if (isAuthenticated && canAccessCrm) {
    return <Navigate to="/dashboard" replace />
  }

  if (isAuthenticated && !canAccessCrm) {
    return <Navigate to="/access-denied" replace />
  }

  return <Outlet />
}

export function OtpGuestRoute() {
  const { loading, isAuthenticated, canAccessCrm } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }

  if (isAuthenticated && canAccessCrm) {
    return <Navigate to="/dashboard" replace />
  }

  if (isAuthenticated && !canAccessCrm) {
    return <Navigate to="/access-denied" replace />
  }

  if (!getLoginPhone()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
