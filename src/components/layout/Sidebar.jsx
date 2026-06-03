import clsx from 'clsx'
import { LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { mainNav, secondaryNav } from '@/config/navigation'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'

const linkClass = ({ isActive }) =>
  clsx(
    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-primary text-white shadow-sm'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
  )

function UserAvatar({ user, name }) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className="h-10 w-10 rounded-full object-cover"
      />
    )
  }

  const initial = (name || 'U').charAt(0).toUpperCase()
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
      {initial}
    </div>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, displayName, roleLabel, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

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
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex w-full items-center gap-3 rounded-xl p-2 transition hover:bg-gray-50"
        >
          <div className="relative shrink-0">
            <UserAvatar user={user} name={displayName} />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>

          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-gray-400">
              {roleLabel}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
