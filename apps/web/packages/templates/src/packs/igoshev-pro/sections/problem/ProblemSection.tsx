import React from 'react'
import ProblemSectionC from './ProblemSectionC'
import { sanitizeCtx } from '../utils'

const ProblemSection = ({ node, ctx }: any) => {
  return (
    <ProblemSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default ProblemSection
