import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { isClientViewerPathAllowed } from '@/config/navigation'

export default function ProtectedRoute() {
  const { loading, isAuthenticated, canAccessCrm, isClientViewer } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-gray-500">Loading session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!canAccessCrm) {
    return <Navigate to="/access-denied" replace />
  }

  // Client logins are read-only monitors of their own farmers.
  if (isClientViewer && !isClientViewerPathAllowed(location.pathname)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
