import React from 'react'
import CaseStudiesSectionC from './CaseStudiesSectionC'
import { sanitizeCtx } from '../utils'

const CaseStudiesSection = ({ node, ctx }: any) => {
  return (
    <CaseStudiesSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default CaseStudiesSection
