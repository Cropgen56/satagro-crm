// SettingsPage.jsx

import React from 'react'
import PageTopBar from '@/components/layout/PageTopBar'

import SettingsHeader from '@/components/settings/SettingsHeader'
import SettingsSidebar from '@/components/settings/SettingsSidebar'
import OrganizationInformationCard from '@/components/settings/OrganizationInformationCard'
import RegionalPreferencesCard from '@/components/settings/RegionalPreferencesCard'
import SystemPreferencesCard from '@/components/settings/SystemPreferencesCard'

const SettingsPage = () => {
  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <SettingsHeader />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr]">
        <SettingsSidebar />

        <div className="space-y-6">
          <OrganizationInformationCard />
          <RegionalPreferencesCard />
          <SystemPreferencesCard />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage