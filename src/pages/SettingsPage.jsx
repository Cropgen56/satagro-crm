// SettingsPage.jsx

import React from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import { useAuth } from '@/hooks/useAuth'

import SettingsHeader from '@/components/settings/SettingsHeader'
import SettingsSidebar from '@/components/settings/SettingsSidebar'
import OrganizationInformationCard from '@/components/settings/OrganizationInformationCard'
import RegionalPreferencesCard from '@/components/settings/RegionalPreferencesCard'
import SystemPreferencesCard from '@/components/settings/SystemPreferencesCard'

const SettingsPage = () => {
  const { user, roleLabel, assignments } = useAuth()

  const userDetails = [
    { label: 'Full Name', value: [user?.firstName, user?.lastName].filter(Boolean).join(' ') },
    { label: 'Email', value: user?.email },
    { label: 'Phone', value: user?.phone },
    { label: 'Role', value: roleLabel || user?.role },
    { label: 'Country', value: user?.country },
    { label: 'State', value: user?.state },
    { label: 'City', value: user?.city },
    { label: 'Village', value: user?.village },
    { label: 'Language', value: user?.language },
    {
      label: 'Last Login',
      value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : null,
    },
    {
      label: 'Last Active',
      value: user?.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : null,
    },
    { label: 'Joined On', value: user?.createdAt ? new Date(user.createdAt).toLocaleString() : null },
    {
      label: 'Admin Assignments',
      value: Array.isArray(assignments) && assignments.length > 0 ? String(assignments.length) : '0',
    },
  ]

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <SettingsHeader />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr]">
        <SettingsSidebar />

        <div className="space-y-6">
          <OrganizationInformationCard user={user} />
          <RegionalPreferencesCard user={user} />
          <SystemPreferencesCard userDetails={userDetails} />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage