// SettingsPage.jsx

import React from 'react'
import { useAuth } from '@/hooks/useAuth'

import SettingsHeader from '@/components/settings/SettingsHeader'
import OrganizationInformationCard from '@/components/settings/OrganizationInformationCard'
import ClientOrganizationCard from '@/components/settings/ClientOrganizationCard'
import RegionalPreferencesCard from '@/components/settings/RegionalPreferencesCard'
import SystemPreferencesCard from '@/components/settings/SystemPreferencesCard'

const SettingsPage = () => {
  const { user, roleLabel, assignments, isClientViewer, clientOrganization } = useAuth()

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
    // Client logins never have admin assignments.
    ...(isClientViewer
      ? []
      : [
          {
            label: 'Admin Assignments',
            value:
              Array.isArray(assignments) && assignments.length > 0
                ? String(assignments.length)
                : '0',
          },
        ]),
  ]

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <SettingsHeader />

      <div className="mt-7 space-y-6">
        {isClientViewer ? (
          <ClientOrganizationCard organization={clientOrganization} />
        ) : (
          <OrganizationInformationCard user={user} />
        )}
        <RegionalPreferencesCard user={user} />
        <SystemPreferencesCard userDetails={userDetails} />
      </div>
    </div>
  )
}

export default SettingsPage
