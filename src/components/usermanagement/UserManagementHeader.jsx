import {
  UserPlus,
  Download,
  Upload,
  Settings2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UserManagementHeader() {
  const navigate = useNavigate()

  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
          User Management
        </h1>

        <p className="mt-1 max-w-[420px] text-sm leading-6 text-gray-500">
          Manage users, hierarchy, permissions, and regional access
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => navigate('/invite-user')}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
        >
          <UserPlus className="h-4 w-4" />
          Invite User
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>

          <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            Import
          </button>

          <button
            onClick={() => navigate('/role-settings')}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Settings2 className="h-4 w-4" />
            Role Settings
          </button>
        </div>
      </div>
    </header>
  )
}