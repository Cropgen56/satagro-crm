import PageTopBar from '@/components/layout/PageTopBar'
import NotificationsHeader from '@/components/notifications/NotificationsHeader'
import EmptyState from '@/components/ui/EmptyState'
import { Bell } from 'lucide-react'

export default function Notificationspage() {
  return (
    <div className="min-h-full bg-[#F5F7F6] p-6 lg:p-8">
      <PageTopBar />
      <div className="mt-8">
        <NotificationsHeader />
      </div>
      <div className="mt-8">
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="System and operational notifications will appear here when notification feeds are connected."
        />
      </div>
    </div>
  )
}
