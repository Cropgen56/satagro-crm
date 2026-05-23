import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardPage from '@/pages/DashboardPage'
import EmptyPage from '@/pages/EmptyPage'
import AddFarmerPage from '@/pages/AddFarmerPage'
import FarmerDetailPage from '@/pages/FarmerDetailPage'
import AddLeadPage from '@/pages/AddLeadPage'
import ConvertLeadPage from '@/pages/ConvertLeadPage'
import FarmersPage from '@/pages/FarmersPage'
import LeadDetailPage from '@/pages/LeadDetailPage'
import ActivitiesPage from '@/pages/ActivitiesPage'
import ActivityDetailPage from '@/pages/ActivityDetailPage'
import LeadsPage from '@/pages/LeadsPage'
import CreateTaskPage from '@/pages/CreateTaskPage'
import LogActivityPage from '@/pages/LogActivityPage'
import TaskDetailPage from '@/pages/TaskDetailPage'
import TasksPage from '@/pages/TasksPage'
import LoginPage from '@/pages/LoginPage'
import OtpPage from '@/pages/OtpPage'
import SubscriptionPage from '@/pages/SubscriptionPage'
import AdvisoryPage from '@/pages/AdvisoryPage'
import Notificationspage from '@/pages/Notificationspage'
import Reportpage from '@/pages/Reportpage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OtpPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/farmers/add" element={<AddFarmerPage />} />
        <Route path="/farmers/:id" element={<FarmerDetailPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/add" element={<AddLeadPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/leads/:id/convert" element={<ConvertLeadPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/log" element={<LogActivityPage />} />
        <Route path="/activities/:id" element={<ActivityDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/create" element={<CreateTaskPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/advisories" element={<AdvisoryPage />} />
        <Route path="/notifications" element={<Notificationspage />} />
        <Route path="/reports" element={<Reportpage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route
          path="/user-management"
          element={<EmptyPage title="User Management" />}
        />

        <Route
          path="/settings"
          element={<SettingsPage/>}
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}