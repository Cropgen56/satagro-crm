import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RootRedirect from '@/components/auth/RootRedirect'
import { LoginGuestRoute, OtpGuestRoute } from '@/components/auth/GuestRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardPage from '@/pages/DashboardPage'
import FarmerDetailPage from '@/pages/FarmerDetailPage'
import FarmersPage from '@/pages/FarmersPage'
import ClientsPage from '@/pages/ClientsPage'
import LoginPage from '@/pages/LoginPage'
import OtpPage from '@/pages/OtpPage'
import AcceptInvitationPage from '@/pages/AcceptInvitationPage'
import AccessDeniedPage from '@/pages/AccessDeniedPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import UserManagementPage from '@/pages/UserManagementPage'
import InviteUserPage from '@/pages/InviteUserPage'
import InvitationSentPage from '@/pages/InvitationSentPage'
import PendingInvitationPage from '@/pages/PendingInvitationPage'
import UserDetailPage from '@/pages/UserDetailPage'
import EditUserPage from '@/pages/EditUserPage'
import SubscriptionPage from '@/pages/SubscriptionPage'
import SubscriptionPlansPage from '@/pages/SubscriptionPlansPage'
import SubscriptionPlanFormPage from '@/pages/SubscriptionPlanFormPage'
import AccessCardsPage from '@/pages/AccessCardsPage'
import GenerateCardsPage from '@/pages/GenerateCardsPage'
import AccessCardDetailPage from '@/pages/AccessCardDetailPage'
import SubscribersPage from '@/pages/SubscribersPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductFormPage from '@/pages/ProductFormPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import EcommercePage from '@/pages/EcommercePage'
import EcommercePaymentsPage from '@/pages/EcommercePaymentsPage'
import EcommerceInvoicesPage from '@/pages/EcommerceInvoicesPage'
import { RedirectOrderDetail, RedirectProductEdit } from '@/components/ecommerce/RedirectRoutes'

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
          <Route path="/farmers/:id" element={<FarmerDetailPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/products" element={<Navigate to="/ecommerce/products" replace />} />
          <Route path="/products/new" element={<Navigate to="/ecommerce/products/new" replace />} />
          <Route path="/products/:id/edit" element={<RedirectProductEdit />} />
          <Route path="/orders" element={<Navigate to="/ecommerce/orders" replace />} />
          <Route path="/orders/:id" element={<RedirectOrderDetail />} />

          <Route path="/ecommerce" element={<EcommercePage />} />
          <Route path="/ecommerce/products" element={<ProductsPage />} />
          <Route path="/ecommerce/products/new" element={<ProductFormPage />} />
          <Route path="/ecommerce/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/ecommerce/orders" element={<OrdersPage />} />
          <Route path="/ecommerce/orders/:id" element={<OrderDetailPage />} />
          <Route path="/ecommerce/payments" element={<EcommercePaymentsPage />} />
          <Route path="/ecommerce/invoices" element={<EcommerceInvoicesPage />} />

          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/subscriptions/plans/new" element={<SubscriptionPlanFormPage />} />
          <Route path="/subscriptions/plans/:id/edit" element={<SubscriptionPlanFormPage />} />
          <Route path="/subscriptions/plans" element={<SubscriptionPlansPage />} />
          <Route path="/subscriptions/cards/generate" element={<GenerateCardsPage />} />
          <Route path="/subscriptions/cards/:id" element={<AccessCardDetailPage />} />
          <Route path="/subscriptions/cards" element={<AccessCardsPage />} />
          <Route path="/subscriptions/subscribers" element={<SubscribersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/user-management/:id/edit" element={<EditUserPage />} />
          <Route path="/user-management/:id" element={<UserDetailPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/invite-user" element={<InviteUserPage />} />
          <Route path="/invitation-sent" element={<InvitationSentPage />} />
          <Route path="/pending-invitation" element={<PendingInvitationPage />} />
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
