import {
  Building2,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Tractor,
  UserCog,
  UserRound,
} from 'lucide-react'

export const subscriptionNav = {
  label: 'Subscriptions',
  path: '/subscriptions',
  icon: CreditCard,
  children: [
    { label: 'Subscription plans', path: '/subscriptions/plans' },
    { label: 'Subscription cards', path: '/subscriptions/cards' },
    { label: 'Subscribers', path: '/subscriptions/subscribers' },
  ],
}

export const ecommerceNav = {
  label: 'Ecommerce',
  path: '/ecommerce',
  icon: ShoppingBag,
  children: [
    { label: 'Products', path: '/ecommerce/products' },
    { label: 'Orders', path: '/ecommerce/orders' },
    { label: 'Payments', path: '/ecommerce/payments' },
    { label: 'Invoices', path: '/ecommerce/invoices' },
  ],
}

export const mainNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Farmers', path: '/farmers', icon: Tractor },
  subscriptionNav,
  ecommerceNav,
]

export const secondaryNav = [
  { label: 'User Management', path: '/user-management', icon: UserCog },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export const clientsNav = { label: 'Clients', path: '/clients', icon: Building2 }

/** Client viewers only monitor their farmers; everything else is hidden. */
const CLIENT_VIEWER_NAV_PATHS = new Set(['/dashboard', '/farmers'])

/** Client viewers' own account pages (read-only). */
const clientViewerAccountNav = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Profile', path: '/profile', icon: UserRound },
]

export function getMainNav({ isClientViewer = false } = {}) {
  if (!isClientViewer) return mainNav
  return mainNav.filter((item) => CLIENT_VIEWER_NAV_PATHS.has(item.path))
}

export function getSecondaryNav({ isClientViewer = false, canManageClients = false } = {}) {
  if (isClientViewer) return clientViewerAccountNav
  return canManageClients ? [clientsNav, ...secondaryNav] : secondaryNav
}

/** Pages a client viewer may open: dashboard, farmer list/detail, settings, profile. */
export function isClientViewerPathAllowed(pathname) {
  if (
    pathname === '/dashboard' ||
    pathname === '/farmers' ||
    pathname === '/settings' ||
    pathname === '/profile'
  ) {
    return true
  }
  return /^\/farmers\/(?!add(?:\/|$))[^/]+\/?$/.test(pathname)
}

function flattenNavItem(item) {
  if (item.children?.length) {
    return [item, ...item.children]
  }
  return [item]
}

export const allNavItems = [...mainNav.flatMap(flattenNavItem), clientsNav, ...secondaryNav]

export function isNavChildActive(pathname, childPath) {
  if (childPath === '/subscriptions') {
    return pathname === '/subscriptions'
  }
  if (childPath === '/ecommerce') {
    return pathname === '/ecommerce'
  }
  return pathname === childPath || pathname.startsWith(`${childPath}/`)
}

export function isNavGroupActive(pathname, group) {
  if (!group.children?.length) return false
  return group.children.some((child) => isNavChildActive(pathname, child.path))
}
