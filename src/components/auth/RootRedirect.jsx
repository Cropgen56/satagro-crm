import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RootRedirect() {
  const { loading, isAuthenticated, canAccessCrm } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-gray-500">Loading session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!canAccessCrm) {
    return <Navigate to="/access-denied" replace />
  }

  return <Navigate to="/dashboard" replace />
}
