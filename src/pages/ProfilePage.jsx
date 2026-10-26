// ProfilePage.jsx

import React from 'react'

import ProfileHeader from '@/components/profile/ProfileHeader'
import PersonalInformationCard from '@/components/profile/PersonalInformationCard'
import AccountSummaryCard from '@/components/profile/AccountSummaryCard'

const ProfilePage = () => {
  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <ProfileHeader />

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <PersonalInformationCard />

        <div className="space-y-5">
          <AccountSummaryCard />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
