import clsx from 'clsx'
import { ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  isNavChildActive,
  isNavGroupActive,
  mainNav,
  secondaryNav,
} from '@/config/navigation'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEM =
  'group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30'

function navItemClass(isActive) {
  return clsx(
    NAV_ITEM,
    isActive
      ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
  )
}

function groupHeaderClass(isExpanded, isGroupActive) {
  return clsx(
    NAV_ITEM,
    isGroupActive
      ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
      : isExpanded
        ? 'bg-gray-50/80 text-gray-800'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
  )
}

function childLinkClass(isActive) {
  return clsx(
    'relative flex w-full cursor-pointer items-center rounded-lg py-2 pl-5 pr-3 text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30',
    isActive
      ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
  )
}

function NavIcon({ Icon, isActive, inGroup = false }) {
  return (
    <span
      className={clsx(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
        inGroup
          ? isActive
            ? 'bg-white/15 text-white'
            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200/70 group-hover:text-gray-700'
          : isActive
            ? 'bg-white/15 text-white'
            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200/70 group-hover:text-gray-700',
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </span>
  )
}

function UserAvatar({ user, name }) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
      />
    )
  }

  const initial = (name || 'U').charAt(0).toUpperCase()
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white ring-2 ring-white">
      {initial}
    </div>
  )
}

function SidebarNavGroup({ item }) {
  const { pathname } = useLocation()
  const groupActive = isNavGroupActive(pathname, item)
  const [expanded, setExpanded] = useState(groupActive)
  const Icon = item.icon

  useEffect(() => {
    if (groupActive) setExpanded(true)
  }, [groupActive])

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className={groupHeaderClass(expanded, groupActive)}
      >
        <NavIcon Icon={Icon} isActive={groupActive} inGroup />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            expanded && 'rotate-180',
            groupActive ? 'text-white/70' : 'text-gray-400',
          )}
        />
      </button>

      <div
        className={clsx(
          'grid transition-[grid-template-rows] duration-200 ease-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="relative ml-[22px] space-y-0.5 border-l border-gray-200/80 py-1 pl-3">
            {item.children.map((child) => {
              const active = isNavChildActive(pathname, child.path)
              return (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={childLinkClass(active)}
                >
                  <span
                    className={clsx(
                      'absolute -left-px top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200',
                      active ? 'scale-100 bg-white' : 'scale-0 bg-transparent',
                    )}
                  />
                  {child.label}
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarNavItem({ item }) {
  if (item.children?.length) {
    return <SidebarNavGroup item={item} />
  }

  const Icon = item.icon
  return (
    <NavLink to={item.path} className={({ isActive }) => navItemClass(isActive)}>
      {({ isActive }) => (
        <>
          <NavIcon Icon={Icon} isActive={isActive} />
          {item.label}
        </>
      )}
    </NavLink>
  )
}

function SidebarSectionLabel({ children }) {
  return (
    <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
      {children}
    </p>
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
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-gray-200/80 bg-white">
      <div className="flex h-20 shrink-0 items-center border-b border-gray-100 px-5">
        <Logo size="sidebar" />
      </div>

      <nav className="sidebar-scroll flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        <SidebarSectionLabel>Main</SidebarSectionLabel>

        {mainNav.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}

        <SidebarSectionLabel>Administration</SidebarSectionLabel>

        {secondaryNav.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => navItemClass(isActive)}>
            {({ isActive }) => (
              <>
                <NavIcon Icon={Icon} isActive={isActive} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-gray-100 p-3">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-2.5 transition hover:border-gray-200 hover:bg-gray-50"
        >
          <div className="relative shrink-0">
            <UserAvatar user={user} name={displayName} />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>

          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-semibold text-gray-900">
              {displayName}
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-gray-400">
              {roleLabel}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-1.5 flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
