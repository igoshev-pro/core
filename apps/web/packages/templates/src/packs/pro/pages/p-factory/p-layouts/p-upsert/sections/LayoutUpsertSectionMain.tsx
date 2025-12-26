import LayoutUpsertSectionMainC from './LayoutUpsertSectionMainC'
import { UpsertType } from '@/packages/templates/common/enum/main'

export type LayoutUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const LayoutUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <LayoutUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default LayoutUpsertSectionMain