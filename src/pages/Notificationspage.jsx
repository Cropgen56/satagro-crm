import React, { useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'

import NotificationsHeader from '@/components/notifications/NotificationsHeader'
import NotificationsKpiCard from '@/components/notifications/NotificationsKpiCard'
import NotificationsFilterBar from '@/components/notifications/NotificationsFilterBar'
import NotificationCard from '@/components/notifications/NotificationCard'

const Notificationspage = () => {
  const [activeTab, setActiveTab] = useState('All')

  const [filters, setFilters] = useState({
    type: 'Notification Type',
    priority: 'Priority',
  })

  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />

      <div className="mt-8">
        <NotificationsHeader />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <NotificationsKpiCard
          label="Total"
          value="42"
          icon="mail"
          color="bg-[#E7F1EE] text-[#005347]"
        />

        <NotificationsKpiCard
          label="Unread"
          value="12"
          icon="mail"
          color="bg-[#E7F1EE] text-[#005347]"
        />

        <NotificationsKpiCard
          label="High Priority"
          value="5"
          icon="alert"
          color="bg-[#FCE8E6] text-[#D93025]"
        />

        <NotificationsKpiCard
          label="System"
          value="8"
          icon="system"
          color="bg-[#E8F0FE] text-[#2563EB]"
        />

        <NotificationsKpiCard
          label="Advisory"
          value="17"
          icon="advisory"
          color="bg-[#FEF3E2] text-[#E57C00]"
        />
      </div>

      <div className="mt-8">
        <NotificationsFilterBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center gap-4">
          <h2 className="text-[20px] font-semibold text-[#1E1E1E]">
            Today
          </h2>

          <div className="h-px flex-1 bg-[#E4E4E4]" />
        </div>

        <div className="space-y-4">
          <NotificationCard
            title="Subscription Expiry"
            type="critical"
            unread
            actionText="View Details"
            time="2 hours ago"
            description="Premium plan for Farmer #284 expires in 3 days. Please renew to avoid service interruption for automated pest sensing."
          />

          <NotificationCard
            title="Activity Reminder"
            type="warning"
            actionText="View Details"
            time="4 hours ago"
            description="Soil testing visit scheduled for 2:00 PM today at the Central Farm block. Farmer Patil is expecting a report on nitrogen levels."
          />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-5 flex items-center gap-4">
          <h2 className="text-[20px] font-semibold text-[#1E1E1E]">
            Yesterday
          </h2>

          <div className="h-px flex-1 bg-[#E4E4E4]" />
        </div>

        <div className="space-y-4">
          <NotificationCard
            title="Advisory Failure"
            type="critical"
            unread
            actionText="Retry Now"
            time="Yesterday, 5:42 PM"
            description="Pest alert SMS failed for 142 recipients in Pune North due to gateway timeout. Urgent re-queue required for local safety compliance."
          />

          <NotificationCard
            title="New Lead Assigned"
            type="info"
            actionText="View Profile"
            time="Yesterday, 11:20 AM"
            description="A new prospect 'Green Acres' has been assigned to you. Lead source: Agricultural Expo 2024. Contact scheduled for Monday."
          />
        </div>
      </div>

      <div className="mt-14 flex justify-center">
        <button className="rounded-full border border-[#D8D8D8] bg-[#F8F8F8] px-8 py-4 text-[16px] font-semibold text-brand-primary shadow-sm transition hover:bg-white">
          Load Previous Notifications
        </button>
      </div>
    </div>
  )
}

export default Notificationspage