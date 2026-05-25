// components/usermanagement/create-role/CreateRoleLayout.jsx

import CreateRoleMain from './CreateRoleMain'
import CreateRolePreview from './CreateRolePreview'
import CreateRoleFooter from './CreateRoleFooter'
import { useNavigate } from 'react-router-dom'

export default function CreateRoleLayout() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
            Create Role
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Define a new operational role and hierarchy structure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/role-settings')}
            className="h-10 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700"
          >
            Back
          </button>

          <button className="h-10 cursor-pointer rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white shadow-sm">
            Sace Draft
          </button>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[2fr_0.95fr]">
        <CreateRoleMain />
        <CreateRolePreview />
      </div>

      <CreateRoleFooter />
    </div>
  )
}