// components/usermanagement/role-settings/RoleSettingsLayout.jsx

import RoleSettingsTop from './RoleSettingsTop'
import RoleSettingsMain from './RoleSettingsMain'
import RoleSettingsSidebar from './RoleSettingsSidebar'

export default function RoleSettingsLayout() {
  return (
    <div className="space-y-6">
      <RoleSettingsTop />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.95fr_0.95fr]">
        <RoleSettingsMain />
        <RoleSettingsSidebar />
      </div>
    </div>
  )
}