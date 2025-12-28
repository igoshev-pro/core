import { UpsertType } from '@/packages/templates/common/enum/main'
import ProjectUpsertSectionMainC from './ProjectUpsertSectionMainC'

export type ProjectUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const ProjectUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <ProjectUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default ProjectUpsertSectionMain