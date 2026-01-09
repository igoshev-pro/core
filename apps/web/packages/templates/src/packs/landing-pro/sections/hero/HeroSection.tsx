import React from 'react'
import HeroSectionC from './HeroSectionC'
import { sanitizeCtx } from '../utils'

const HeroSection = ({ node, ctx }: any) => {
  return (
    <HeroSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default HeroSection
