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
  refreshAccessToken,
  isAuthErrorMessage,
  extractAccessToken,
  extractRefreshToken,
} from '@/lib/api'
import {
  canAccessCrm,
  clearAuthStorage,
  formatUserDisplayName,
  formatUserRoleLabel,
  getRefreshToken,
  getUserId,
  hasStoredSession,
  normalizeProfileUser,
  setAccessToken,
  setRefreshToken,
} from '@/lib/auth'
import { buildHierarchyFromSession } from '@/lib/adminHierarchy'
import { fetchHierarchyCapabilities } from '@/lib/usermanagement'

const AuthContext = createContext(null)

async function fetchSession() {
  const [profileRes, assignmentsRes, hierarchyRes] = await Promise.all([
    apiRequest('/profile'),
    apiRequest('/admin-assignments/me'),
    fetchHierarchyCapabilities().catch(() => null),
  ])

  const user = normalizeProfileUser(profileRes?.user)
  const assignments = assignmentsRes?.assignments || []
  const serverHierarchy = hierarchyRes?.hierarchy || null

  return { user, assignments, serverHierarchy }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [serverHierarchy, setServerHierarchy] = useState(null)
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    if (!hasStoredSession()) {
      setUser(null)
      setAssignments([])
      setServerHierarchy(null)
      setLoading(false)
      return
    }

    try {
      const session = await fetchSession()
      setUser(session.user)
      setAssignments(session.assignments)
      setServerHierarchy(session.serverHierarchy)
    } catch (firstError) {
      if (getRefreshToken()) {
        try {
          await refreshAccessToken()
          const session = await fetchSession()
          setUser(session.user)
          setAssignments(session.assignments)
          setServerHierarchy(session.serverHierarchy)
          return
        } catch {
          // Fall through to clear session below.
        }
      }

      if (isAuthErrorMessage(firstError?.message) || !getRefreshToken()) {
        clearAuthStorage()
      }
      setUser(null)
      setAssignments([])
      setServerHierarchy(null)
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
      setServerHierarchy(null)
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
    setServerHierarchy(session.serverHierarchy)
    return session
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
    setAssignments([])
    setServerHierarchy(null)
  }, [])

  const hierarchy = useMemo(() => {
    const local = buildHierarchyFromSession(user, assignments)
    if (!serverHierarchy?.creatableLevels?.length) return local

    let creatableLevels = serverHierarchy.creatableLevels
    if (local.highestLevel === 'super' || serverHierarchy.highestLevel === 'super') {
      creatableLevels = creatableLevels.filter((level) => level !== 'super')
    }

    return {
      ...local,
      highestLevel: serverHierarchy.highestLevel || local.highestLevel,
      creatableLevels,
      geoScope: serverHierarchy.geoScope || local.geoScope,
      canInvite: creatableLevels.length > 0,
    }
  }, [user, assignments, serverHierarchy])

  const value = useMemo(
    () => ({
      user,
      assignments,
      hierarchy,
      loading,
      currentUserId: getUserId(user),
      isAuthenticated: Boolean(user && hasStoredSession()),
      canAccessCrm: canAccessCrm(user, assignments),
      canInviteUsers: hierarchy.canInvite,
      displayName: formatUserDisplayName(user),
      roleLabel: formatUserRoleLabel(user, assignments),
      completeLogin,
      logout,
      refreshSession: bootstrap,
    }),
    [user, assignments, hierarchy, loading, completeLogin, logout, bootstrap],
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
