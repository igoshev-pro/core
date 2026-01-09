import React from 'react'
import HowItWorksSectionC from './HowItWorksSectionC'
import { sanitizeCtx } from '../utils'

const HowItWorksSection = ({ node, ctx }: any) => {
  return (
    <HowItWorksSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default HowItWorksSection
