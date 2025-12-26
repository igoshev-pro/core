import WidgetUpsertSectionMainC from './WidgetUpsertSectionMain'
import { UpsertType } from '@/packages/templates/common/enum/main'

export type WidgetUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const WidgetUpsertSectionMain = ({ node, ctx }: any) => {
  console.log(333, node, ctx)
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <WidgetUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default WidgetUpsertSectionMain