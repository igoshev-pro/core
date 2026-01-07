import React from 'react'
import CMSettingsSectionC from './CMSSettingsSectionC'

const CMSSettingsSection = ({ node, ctx }: any) => {
  return (
    <CMSettingsSectionC projectId={ctx.projectId} />
  )
}

export default CMSSettingsSection