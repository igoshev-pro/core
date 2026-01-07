import React from 'react'
import CMSMenuSectionC from './CMSMenuSectionC'

const CMSMenuSection = ({ node, ctx }: any) => {
  return (
    <CMSMenuSectionC projectId={ctx.projectId} />
  )
}

export default CMSMenuSection

