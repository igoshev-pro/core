import React from 'react'
import PricingPreviewSectionC from './PricingPreviewSectionC'
import { sanitizeCtx } from '../utils'

const PricingPreviewSection = ({ node, ctx }: any) => {
  return (
    <PricingPreviewSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default PricingPreviewSection
