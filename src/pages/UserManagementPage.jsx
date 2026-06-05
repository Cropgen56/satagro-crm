import { useCallback, useEffect, useMemo, useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import UserManagementHeader from '@/components/usermanagement/UserManagementHeader'
import UserManagementKpiCards from '@/components/usermanagement/UserManagementKpiCards'
import UserManagementTable from '@/components/usermanagement/UserManagementTable'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
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
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebouncedValue(searchQuery)

  const pendingCount = useMemo(() => stats?.pending ?? 0, [stats])

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const statsRes = await fetchUserManagementStats()
      setStats(statsRes?.stats || null)
    } catch (err) {
      setError(err.message || 'Failed to load team stats')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadUsers = useCallback(
    async (page = 1, status = statusFilter, search = debouncedSearch) => {
      try {
        setLoading(true)
        setError('')
        const apiStatus = normalizeStatusFilter(status)
        const usersRes = await fetchUserManagementList({
          page,
          limit: 20,
          ...(apiStatus !== 'all' ? { status: apiStatus } : {}),
          ...(search?.trim() ? { search: search.trim() } : {}),
        })
        setUsers(usersRes?.users || [])
        setPagination(usersRes?.pagination || {})
      } catch (err) {
        setError(err.message || 'Failed to load team members')
      } finally {
        setLoading(false)
      }
    },
    [statusFilter, debouncedSearch]
  )

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    loadUsers(1, statusFilter, debouncedSearch)
  }, [debouncedSearch, statusFilter, loadUsers])

  const handleRefresh = useCallback(() => {
    const page = pagination?.currentPage || pagination?.page || 1
    loadStats()
    loadUsers(page, statusFilter, debouncedSearch)
  }, [pagination, statusFilter, debouncedSearch, loadStats, loadUsers])

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mx-auto mt-6 max-w-[1400px] space-y-6">
        <UserManagementHeader pendingCount={pendingCount} />

        <UserManagementKpiCards stats={stats} loading={statsLoading} />

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
          onPageChange={(page) => loadUsers(page, statusFilter, debouncedSearch)}
          onStatusFilterChange={setStatusFilter}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
