
import { UpsertType } from '@/packages/templates/common/enum/main'
import WidgetUpsertSectionMainC from './WidgetUpsertSectionMainC'

export type WidgetUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const WidgetUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <WidgetUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default WidgetUpsertSectionMain