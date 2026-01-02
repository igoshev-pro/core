import React from 'react'
import CMSPagesSectionC from './CMSPagesSectionC'

const CMSSettingsSection = ({ node, ctx }: any) => {
  return (
    <CMSPagesSectionC projectId={ctx.projectId} />
  )
}

export default CMSSettingsSection