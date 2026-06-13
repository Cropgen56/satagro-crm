import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { bootstrapSession, clearSession } from '@/store/slices/authSlice'

export default function AuthInitializer({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(bootstrapSession())
  }, [dispatch])

  useEffect(() => {
    const onExpired = () => dispatch(clearSession())
    window.addEventListener('satagro:auth-expired', onExpired)
    return () => window.removeEventListener('satagro:auth-expired', onExpired)
  }, [dispatch])

  return children
}
