import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  bootstrapSession,
  completeLogin as completeLoginThunk,
  logout as logoutThunk,
  selectAssignments,
  selectCanAccessCrm,
  selectCanInviteUsers,
  selectCurrentUserId,
  selectDisplayName,
  selectHierarchy,
  selectIsAuthenticated,
  selectLoading,
  selectRoleLabel,
  selectUser,
} from '@/store/slices/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const assignments = useAppSelector(selectAssignments)
  const hierarchy = useAppSelector(selectHierarchy)
  const loading = useAppSelector(selectLoading)
  const currentUserId = useAppSelector(selectCurrentUserId)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const canAccessCrm = useAppSelector(selectCanAccessCrm)
  const canInviteUsers = useAppSelector(selectCanInviteUsers)
  const displayName = useAppSelector(selectDisplayName)
  const roleLabel = useAppSelector(selectRoleLabel)

  const completeLogin = useCallback(
    (verifyResponse) => dispatch(completeLoginThunk(verifyResponse)).unwrap(),
    [dispatch],
  )

  const logout = useCallback(
    () => dispatch(logoutThunk()).unwrap(),
    [dispatch],
  )

  const refreshSession = useCallback(
    () => dispatch(bootstrapSession()).unwrap(),
    [dispatch],
  )

  return {
    user,
    assignments,
    hierarchy,
    loading,
    currentUserId,
    isAuthenticated,
    canAccessCrm,
    canInviteUsers,
    displayName,
    roleLabel,
    completeLogin,
    logout,
    refreshSession,
  }
}
