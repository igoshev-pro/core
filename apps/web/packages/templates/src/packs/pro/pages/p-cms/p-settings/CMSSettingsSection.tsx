import React from 'react'
import CMSettingsSectionC from './CMSSettingsSectionC'

const CMSSettingsSection = ({ node, ctx }: any) => {
  return (
    <CMSettingsSectionC type={node.props.type} projectId={ctx.projectId} />
  )
}

export default CMSSettingsSection