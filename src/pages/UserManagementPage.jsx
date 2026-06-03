import { useCallback, useEffect, useMemo, useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import UserManagementHeader from '@/components/usermanagement/UserManagementHeader'
import UserManagementKpiCards from '@/components/usermanagement/UserManagementKpiCards'
import UserManagementTable from '@/components/usermanagement/UserManagementTable'
import {
  fetchUserManagementList,
  fetchUserManagementStats,
  normalizeStatusFilter,
} from '@/lib/usermanagement'

export default function UserManagementPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const pendingCount = useMemo(
    () => (stats?.pending ?? 0) + (stats?.awaitingLogin ?? 0),
    [stats]
  )

  const loadPage = useCallback(
    async (page = 1, status = statusFilter, search = searchQuery) => {
      try {
        setLoading(true)
        setError('')
        const apiStatus = normalizeStatusFilter(status)
        const [statsRes, usersRes] = await Promise.all([
          fetchUserManagementStats(),
          fetchUserManagementList({
            page,
            limit: 20,
            ...(apiStatus !== 'all' ? { status: apiStatus } : {}),
            ...(search?.trim() ? { search: search.trim() } : {}),
          }),
        ])
        setStats(statsRes?.stats || null)
        setUsers(usersRes?.users || [])
        setPagination(usersRes?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load team members')
      } finally {
        setLoading(false)
      }
    },
    [statusFilter, searchQuery]
  )

  useEffect(() => {
    const delay = searchQuery ? 350 : 0
    const timer = setTimeout(() => {
      loadPage(1, statusFilter, searchQuery)
    }, delay)
    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter, loadPage])

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mx-auto mt-6 max-w-[1400px] space-y-6">
        <UserManagementHeader pendingCount={pendingCount} />

        <UserManagementKpiCards stats={stats} />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <UserManagementTable
          users={users}
          pagination={pagination}
          loading={loading}
          search={searchQuery}
          status={statusFilter}
          onSearchChange={setSearchQuery}
          onPageChange={(page) => loadPage(page, statusFilter, searchQuery)}
          onStatusFilterChange={setStatusFilter}
          onRefresh={() =>
            loadPage(
              pagination?.currentPage || pagination?.page || 1,
              statusFilter,
              searchQuery
            )
          }
        />
      </div>
    </div>
  )
}
