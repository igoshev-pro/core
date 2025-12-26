
import { UpsertType } from '@/packages/templates/common/enum/main'
import SectionUpsertSectionMainC from './SectionUpsertSectionMainC'

export type SectionUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const SectionUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <SectionUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default SectionUpsertSectionMain