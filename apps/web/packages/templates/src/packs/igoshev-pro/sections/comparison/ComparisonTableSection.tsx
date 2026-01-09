import React from 'react'
import ComparisonTableSectionC from './ComparisonTableSectionC'
import { sanitizeCtx } from '../utils'

const ComparisonTableSection = ({ node, ctx }: any) => {
  return (
    <ComparisonTableSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default ComparisonTableSection
