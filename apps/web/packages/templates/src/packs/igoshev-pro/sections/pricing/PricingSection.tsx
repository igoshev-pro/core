import React from 'react'
import PricingSectionC from './PricingSectionC'
import { sanitizeCtx } from '../utils'

const PricingSection = ({ node, ctx }: any) => {
  return (
    <PricingSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default PricingSection
