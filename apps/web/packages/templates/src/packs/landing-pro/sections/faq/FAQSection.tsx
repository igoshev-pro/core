import React from 'react'
import FAQSectionC from './FAQSectionC'
import { sanitizeCtx } from '../utils'

const FAQSection = ({ node, ctx }: any) => {
  return (
    <FAQSectionC node={node} ctx={sanitizeCtx(ctx)} />
  )
}

export default FAQSection
