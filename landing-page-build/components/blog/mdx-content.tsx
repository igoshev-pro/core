"use client"

export function MDXContent({ content }: { content: string }) {
  return (
    <div className="article-content space-y-6">
      {/* This would be rendered MDX in production */}
      <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
