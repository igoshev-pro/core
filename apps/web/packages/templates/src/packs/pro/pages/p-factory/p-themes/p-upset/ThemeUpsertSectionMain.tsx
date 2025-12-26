import ThemeUpsertSectionMainC from './ThemeUpsertSectionMainC'
import { UpsertType } from '@/packages/templates/common/enum/main'

export type ThemeUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const ThemeUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <ThemeUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default ThemeUpsertSectionMain