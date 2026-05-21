import clsx from 'clsx'
import { MoreVertical } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { mainNav, secondaryNav } from '@/config/navigation'
import Logo from '@/components/ui/Logo'

const linkClass = ({ isActive }) =>
  clsx(
    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-primary text-white shadow-sm'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
  )

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-gray-200 bg-white">
      <div className="flex h-[60px] shrink-0 items-center border-b border-gray-100 px-5">
        <Logo size="sidebar" />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {mainNav.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} className={linkClass}>
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}

        <div className="my-4 border-t border-gray-100" />

        {secondaryNav.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} className={linkClass}>
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
              alt="Alex Rivers"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">Alex Rivers</p>
            <p className="truncate text-[10px] font-medium tracking-wider text-gray-400">
              OPERATIONS MANAGER
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="User menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
