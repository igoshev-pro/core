import ClientUpsertSectionMainC from './ClientUpsertSectionMainC'
import { UpsertType } from '@/packages/templates/common/enum/main'

export type ClientUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
  id?: string
}

const ClientUpsertSectionMain = ({ node, ctx }: any) => {
  const segments = ctx.path.split('/').filter(Boolean)
  const id = segments.at(-1)

  return (
    <ClientUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} id={id} api={node.props.api} />
  )
}

export default ClientUpsertSectionMain