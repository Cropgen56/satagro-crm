import {
  Bell,
  ClipboardList,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  Leaf,
  ListTodo,
  Package,
  Settings,
  ShoppingBag,
  Target,
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

export const mainNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Farmers', path: '/farmers', icon: Tractor },
  subscriptionNav,
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Orders', path: '/orders', icon: ShoppingBag },
  { label: 'Leads', path: '/leads', icon: Target },
  { label: 'Activities', path: '/activities', icon: ClipboardList },
  { label: 'Tasks', path: '/tasks', icon: ListTodo },
  { label: 'Advisories', path: '/advisories', icon: Leaf },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Reports', path: '/reports', icon: FileBarChart },
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
  return pathname === childPath || pathname.startsWith(`${childPath}/`)
}

export function isNavGroupActive(pathname, group) {
  if (!group.children?.length) return false
  return group.children.some((child) => isNavChildActive(pathname, child.path))
}
