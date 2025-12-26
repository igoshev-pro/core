import { UpsertType } from '@/packages/templates/common/enum/main'
import PageUpsertSectionMainC from './PageUpsertSectionMainC'

export type PageUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const PageUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <PageUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default PageUpsertSectionMain