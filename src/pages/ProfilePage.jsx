// ProfilePage.jsx

import React from 'react'
import PageTopBar from '@/components/layout/PageTopBar'

import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'
import PersonalInformationCard from '@/components/profile/PersonalInformationCard'
import AccountSummaryCard from '@/components/profile/AccountSummaryCard'
import RegionalPerformanceCard from '@/components/profile/RegionalPerformanceCard'
import SupportCard from '@/components/profile/SupportCard'

const ProfilePage = () => {
  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <ProfileHeader />
      </div>

      <div className="mt-8">
        <ProfileTabs />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <PersonalInformationCard />

        <div className="space-y-5">
          <AccountSummaryCard />
          <RegionalPerformanceCard />
          <SupportCard />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage