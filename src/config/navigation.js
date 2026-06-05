import {
  Bell,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  Leaf,
  ListTodo,
  Settings,
  Target,
  Tractor,
  UserCog,
} from 'lucide-react'

export const mainNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Farmers', path: '/farmers', icon: Tractor },
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

export const allNavItems = [...mainNav, ...secondaryNav]
