import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import UserDetailHeader from '@/components/usermanagement/userdetails/UserDetailHeader'
import UserDetailTabs from '@/components/usermanagement/userdetails/UserDetailTabs'
import UserDetailOverview from '@/components/usermanagement/userdetails/UserDetailOverview'
import {
  fetchUserById,
  suspendUserAssignment,
  deleteCrmUser,
} from '@/lib/usermanagement'

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const loadUser = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError('')
      const response = await fetchUserById(id)
      setUserData(response?.user || null)
      setAssignments(response?.assignments || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const handleSuspend = async () => {
    const assignmentId = userData?.assignmentId
    if (!assignmentId) {
      setError('No active assignment to suspend')
      return
    }
    if (!window.confirm(`Suspend access for ${userData.name}?`)) return

    try {
      setActionLoading(true)
      setError('')
      await suspendUserAssignment(assignmentId)
      await loadUser()
    } catch (err) {
      setError(err.message || 'Failed to suspend user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Remove "${userData?.name}" from the CRM team? They will lose all admin access.`
      )
    ) {
      return
    }
    try {
      setActionLoading(true)
      setError('')
      await deleteCrmUser(id)
      navigate('/user-management')
    } catch (err) {
      setError(err.message || 'Failed to remove user')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <UserDetailHeader
          user={userData}
          loading={loading}
          onSuspend={handleSuspend}
          onEdit={() => navigate(`/user-management/${id}/edit`)}
          onDelete={handleDelete}
          suspendDisabled={
            actionLoading ||
            !userData?.assignmentId ||
            userData?.assignmentStatus === 'suspended' ||
            userData?.status === 'DISABLED'
          }
          actionDisabled={actionLoading}
          onBack={() => navigate('/user-management')}
        />
      </div>

      <div className="mt-6">
        <UserDetailTabs />
      </div>

      <div className="mt-5">
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        <UserDetailOverview user={userData} assignments={assignments} />
      </div>
    </div>
  )
}
