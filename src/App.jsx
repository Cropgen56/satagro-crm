import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RootRedirect from '@/components/auth/RootRedirect'
import { LoginGuestRoute, OtpGuestRoute } from '@/components/auth/GuestRoute'
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
import AcceptInvitationPage from '@/pages/AcceptInvitationPage'
import AccessDeniedPage from '@/pages/AccessDeniedPage'
import AdvisoryPage from '@/pages/AdvisoryPage'
import Notificationspage from '@/pages/Notificationspage'
import Reportpage from '@/pages/Reportpage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import UserManagementPage from '@/pages/UserManagementPage'
import InviteUserPage from '@/pages/InviteUserPage'
import RoleAssignPage from '@/pages/RoleAssignPage'
import RegionRulesPage from '@/pages/RegionRulesPage'
import RegionAssignPage from '@/pages/RegionAssignPage'
import PermissionReviewPage from '@/pages/PermissionReviewPage'
import InvitationSentPage from '@/pages/InvitationSentPage'
import PendingInvitationPage from '@/pages/PendingInvitationPage'
import UserDetailPage from '@/pages/UserDetailPage'
import EditUserPage from '@/pages/EditUserPage'
import RoleSettingsPage from '@/pages/RoleSettingsPage'
import CreateRolePage from '@/pages/CreateRolePage'
import ConfigurePermissionsPage from './pages/ConfigurePermissionsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<LoginGuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<OtpGuestRoute />}>
        <Route path="/otp" element={<OtpPage />} />
      </Route>

      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="/invite/accept/:token" element={<AcceptInvitationPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/farmers" element={<FarmersPage />} />
          <Route path="/farmers/add" element={<AddFarmerPage />} />
          <Route path="/farmers/:id" element={<FarmerDetailPage />} />
          <Route path="/region-rules" element={<RegionRulesPage />} />
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

          <Route path="/subscriptions" element={<Navigate to="/dashboard" replace />} />
          <Route path="/advisories" element={<AdvisoryPage />} />
          <Route path="/notifications" element={<Notificationspage />} />
          <Route path="/reports" element={<Reportpage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/user-management/:id/edit" element={<EditUserPage />} />
          <Route path="/user-management/:id" element={<UserDetailPage />} />
          <Route path="/create-role" element={<CreateRolePage />} />
          <Route path="/configure-permissions" element={<ConfigurePermissionsPage />} />
          <Route path="/role-settings" element={<RoleSettingsPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/invite-user" element={<InviteUserPage />} />
          <Route path="/role-assignment" element={<RoleAssignPage />} />
          <Route path="/region-assignment" element={<RegionAssignPage />} />
          <Route path="/permissions-review" element={<PermissionReviewPage />} />
          <Route path="/invitation-sent" element={<InvitationSentPage />} />
          <Route path="/pending-invitation" element={<PendingInvitationPage />} />
          <Route path="/empty" element={<EmptyPage title="Empty Page" />} />
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
