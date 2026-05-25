// components/usermanagement/configure-permissions/ConfigurePermissionsLayout.jsx

import ConfigurePermissionsTop from './ConfigurePermissionsTop'
import ConfigurePermissionsMain from './ConfigurePermissionsMain'
import ConfigurePermissionsFooter from './ConfigurePermissionsFooter'

export default function ConfigurePermissionsLayout() {
  return (
    <div>
      <ConfigurePermissionsTop />

      <div className="mt-7">
        <ConfigurePermissionsMain />
      </div>

      <ConfigurePermissionsFooter />
    </div>
  )
}