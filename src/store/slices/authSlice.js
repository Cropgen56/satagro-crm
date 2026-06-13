import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
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

export const bootstrapSession = createAsyncThunk(
  'auth/bootstrap',
  async () => {
    if (!hasStoredSession()) {
      return { user: null, assignments: [], serverHierarchy: null }
    }

    try {
      return await fetchSession()
    } catch (firstError) {
      if (getRefreshToken()) {
        try {
          await refreshAccessToken()
          return await fetchSession()
        } catch {
          // Fall through to clear session below.
        }
      }

      if (isAuthErrorMessage(firstError?.message) || !getRefreshToken()) {
        clearAuthStorage()
      }

      return { user: null, assignments: [], serverHierarchy: null }
    }
  },
)

export const completeLogin = createAsyncThunk(
  'auth/completeLogin',
  async (verifyResponse, { rejectWithValue }) => {
    const accessToken = extractAccessToken(verifyResponse)
    const refreshToken = extractRefreshToken(verifyResponse)

    if (!accessToken) {
      return rejectWithValue({ message: 'Access token not found in response' })
    }

    setAccessToken(accessToken)
    if (refreshToken) {
      setRefreshToken(refreshToken)
    }

    if (verifyResponse?.onboardingRequired) {
      return rejectWithValue({
        message:
          'Your account setup is incomplete. Contact your administrator.',
      })
    }

    const session = await fetchSession()

    if (!canAccessCrm(session.user, session.assignments)) {
      clearAuthStorage()
      return rejectWithValue({
        message:
          'You do not have CRM admin access. Ask your administrator for an admin assignment.',
        code: 'CRM_ACCESS_DENIED',
      })
    }

    return session
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutRequest()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    assignments: [],
    serverHierarchy: null,
    loading: true,
  },
  reducers: {
    clearSession(state) {
      state.user = null
      state.assignments = []
      state.serverHierarchy = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.loading = true
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.assignments = action.payload.assignments
        state.serverHierarchy = action.payload.serverHierarchy
        state.loading = false
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null
        state.assignments = []
        state.serverHierarchy = null
        state.loading = false
      })
      .addCase(completeLogin.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.assignments = action.payload.assignments
        state.serverHierarchy = action.payload.serverHierarchy
        state.loading = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.assignments = []
        state.serverHierarchy = null
      })
  },
})

export const { clearSession } = authSlice.actions
export default authSlice.reducer

const selectAuthState = (state) => state.auth

export const selectUser = createSelector(
  selectAuthState,
  (auth) => auth.user,
)

export const selectAssignments = createSelector(
  selectAuthState,
  (auth) => auth.assignments,
)

export const selectServerHierarchy = createSelector(
  selectAuthState,
  (auth) => auth.serverHierarchy,
)

export const selectLoading = createSelector(
  selectAuthState,
  (auth) => auth.loading,
)

export const selectHierarchy = createSelector(
  [selectUser, selectAssignments, selectServerHierarchy],
  (user, assignments, serverHierarchy) => {
    const local = buildHierarchyFromSession(user, assignments)
    if (!serverHierarchy?.creatableLevels?.length) return local

    const creatableLevels = serverHierarchy.creatableLevels

    return {
      ...local,
      highestLevel: serverHierarchy.highestLevel || local.highestLevel,
      creatableLevels,
      geoScope: serverHierarchy.geoScope || local.geoScope,
      superAdminSlots: serverHierarchy.superAdminSlots || null,
      canInvite: creatableLevels.length > 0,
    }
  },
)

export const selectCurrentUserId = createSelector(selectUser, (user) =>
  getUserId(user),
)

export const selectIsAuthenticated = createSelector(selectUser, (user) =>
  Boolean(user && hasStoredSession()),
)

export const selectCanAccessCrm = createSelector(
  [selectUser, selectAssignments],
  (user, assignments) => canAccessCrm(user, assignments),
)

export const selectCanInviteUsers = createSelector(
  selectHierarchy,
  (hierarchy) => hierarchy.canInvite,
)

export const selectDisplayName = createSelector(selectUser, (user) =>
  formatUserDisplayName(user),
)

export const selectRoleLabel = createSelector(
  [selectUser, selectAssignments],
  (user, assignments) => formatUserRoleLabel(user, assignments),
)
