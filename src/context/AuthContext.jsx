import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  apiRequest,
  logoutRequest,
  extractAccessToken,
  extractRefreshToken,
} from '@/lib/api'
import {
  canAccessCrm,
  clearAuthStorage,
  formatUserDisplayName,
  formatUserRoleLabel,
  hasStoredSession,
  setAccessToken,
  setRefreshToken,
} from '@/lib/auth'

const AuthContext = createContext(null)

async function fetchSession() {
  const [profileRes, assignmentsRes] = await Promise.all([
    apiRequest('/profile'),
    apiRequest('/admin-assignments/me'),
  ])

  const user = profileRes?.user
  const assignments = assignmentsRes?.assignments || []

  return { user, assignments }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    if (!hasStoredSession()) {
      setUser(null)
      setAssignments([])
      setLoading(false)
      return
    }

    try {
      const session = await fetchSession()
      setUser(session.user)
      setAssignments(session.assignments)
    } catch {
      clearAuthStorage()
      setUser(null)
      setAssignments([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  useEffect(() => {
    const onExpired = () => {
      setUser(null)
      setAssignments([])
    }
    window.addEventListener('satagro:auth-expired', onExpired)
    return () => window.removeEventListener('satagro:auth-expired', onExpired)
  }, [])

  const completeLogin = useCallback(async (verifyResponse) => {
    const accessToken = extractAccessToken(verifyResponse)
    const refreshToken = extractRefreshToken(verifyResponse)

    if (!accessToken) {
      throw new Error('Access token not found in response')
    }

    setAccessToken(accessToken)
    if (refreshToken) {
      setRefreshToken(refreshToken)
    }

    if (verifyResponse?.onboardingRequired) {
      throw new Error(
        'Your account setup is incomplete. Contact your administrator.',
      )
    }

    const session = await fetchSession()

    if (!canAccessCrm(session.user, session.assignments)) {
      clearAuthStorage()
      const err = new Error(
        'You do not have CRM admin access. Ask your administrator for an admin assignment.',
      )
      err.code = 'CRM_ACCESS_DENIED'
      throw err
    }

    setUser(session.user)
    setAssignments(session.assignments)
    return session
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
    setAssignments([])
  }, [])

  const value = useMemo(
    () => ({
      user,
      assignments,
      loading,
      isAuthenticated: Boolean(user && hasStoredSession()),
      canAccessCrm: canAccessCrm(user, assignments),
      displayName: formatUserDisplayName(user),
      roleLabel: formatUserRoleLabel(user, assignments),
      completeLogin,
      logout,
      refreshSession: bootstrap,
    }),
    [user, assignments, loading, completeLogin, logout, bootstrap],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
