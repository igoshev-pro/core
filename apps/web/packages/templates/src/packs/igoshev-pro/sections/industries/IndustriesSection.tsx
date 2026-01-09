import React from 'react'
import IndustriesSectionC from './IndustriesSectionC'
import { sanitizeCtx } from '../utils'

const IndustriesSection = ({ node, ctx }: any) => {
  return (
    <IndustriesSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default IndustriesSection
