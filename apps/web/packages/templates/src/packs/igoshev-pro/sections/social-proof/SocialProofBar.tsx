import React from 'react'
import SocialProofBarC from './SocialProofBarC'
import { sanitizeCtx } from '../utils'

const SocialProofBar = ({ node, ctx }: any) => {
  return (
    <SocialProofBarC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default SocialProofBar
