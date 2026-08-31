import {
  CreditCard,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Tractor,
  UserCog,
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
  // Leads / Activities / Tasks: removed from the sidebar per request. Pages
  // and routes are untouched (unlike Advisories/Notifications/Reports below,
  // which are hidden because they're non-functional placeholders) — these
  // are real, working pages, just no longer linked from the nav.
  // Advisories / Notifications / Reports: hidden for now — each page is an
  // always-empty placeholder ("... will appear once connected to live data"),
  // not wired to any real API yet.
]

export const secondaryNav = [
  { label: 'User Management', path: '/user-management', icon: UserCog },
  { label: 'Settings', path: '/settings', icon: Settings },
]

function flattenNavItem(item) {
  if (item.children?.length) {
    return [item, ...item.children]
  }
  return [item]
}

export const allNavItems = [
  ...mainNav.flatMap(flattenNavItem),
  ...secondaryNav,
]

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
