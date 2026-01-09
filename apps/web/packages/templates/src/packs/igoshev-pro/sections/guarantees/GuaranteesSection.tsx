import React from 'react'
import GuaranteesSectionC from './GuaranteesSectionC'
import { sanitizeCtx } from '../utils'

const GuaranteesSection = ({ node, ctx }: any) => {
  return (
    <GuaranteesSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default GuaranteesSection
