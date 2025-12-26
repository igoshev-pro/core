import TemplateUpsertSectionMainC from './TemplateUpsertSectionMainC'
import { UpsertType } from '@/packages/templates/common/enum/main'

export type TemplateUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const TemplateUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <TemplateUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default TemplateUpsertSectionMain