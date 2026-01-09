import React from 'react'
import SolutionSectionC from './SolutionSectionC'
import { sanitizeCtx } from '../utils'

const SolutionSection = ({ node, ctx }: any) => {
  return (
    <SolutionSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default SolutionSection
