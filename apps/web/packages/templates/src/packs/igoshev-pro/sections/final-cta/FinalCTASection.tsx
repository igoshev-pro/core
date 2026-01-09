import React from 'react'
import FinalCTASectionC from './FinalCTASectionC'
import { sanitizeCtx } from '../utils'

const FinalCTASection = ({ node, ctx }: any) => {
  return (
    <FinalCTASectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default FinalCTASection
