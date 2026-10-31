import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RootRedirect from '@/components/auth/RootRedirect'
import { LoginGuestRoute, OtpGuestRoute } from '@/components/auth/GuestRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { RedirectOrderDetail, RedirectProductEdit } from '@/components/ecommerce/RedirectRoutes'
import PageLoader from '@/components/ui/PageLoader'

// Each page is its own chunk, loaded when first opened.
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const FarmerDetailPage = lazy(() => import('@/pages/FarmerDetailPage'))
const FarmersPage = lazy(() => import('@/pages/FarmersPage'))
const ClientsPage = lazy(() => import('@/pages/ClientsPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const OtpPage = lazy(() => import('@/pages/OtpPage'))
const AcceptInvitationPage = lazy(() => import('@/pages/AcceptInvitationPage'))
const AccessDeniedPage = lazy(() => import('@/pages/AccessDeniedPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'))
const InviteUserPage = lazy(() => import('@/pages/InviteUserPage'))
const InvitationSentPage = lazy(() => import('@/pages/InvitationSentPage'))
const PendingInvitationPage = lazy(() => import('@/pages/PendingInvitationPage'))
const UserDetailPage = lazy(() => import('@/pages/UserDetailPage'))
const EditUserPage = lazy(() => import('@/pages/EditUserPage'))
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'))
const SubscriptionPlansPage = lazy(() => import('@/pages/SubscriptionPlansPage'))
const SubscriptionPlanFormPage = lazy(() => import('@/pages/SubscriptionPlanFormPage'))
const AccessCardsPage = lazy(() => import('@/pages/AccessCardsPage'))
const GenerateCardsPage = lazy(() => import('@/pages/GenerateCardsPage'))
const AccessCardDetailPage = lazy(() => import('@/pages/AccessCardDetailPage'))
const SubscribersPage = lazy(() => import('@/pages/SubscribersPage'))
const ClientCustomSubscriptionPage = lazy(() => import('@/pages/ClientCustomSubscriptionPage'))
const ClientSubscriptionPage = lazy(() => import('@/pages/ClientSubscriptionPage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductFormPage = lazy(() => import('@/pages/ProductFormPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'))
const EcommercePage = lazy(() => import('@/pages/EcommercePage'))
const EcommercePaymentsPage = lazy(() => import('@/pages/EcommercePaymentsPage'))
const EcommerceInvoicesPage = lazy(() => import('@/pages/EcommerceInvoicesPage'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader fullScreen />}>
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
            <Route path="/subscriptions/client-plans" element={<ClientCustomSubscriptionPage />} />
            <Route path="/client-subscription" element={<ClientSubscriptionPage />} />
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
    </Suspense>
  )
}
