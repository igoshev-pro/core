import ClientUpsertSectionMainC from './ClientUpsertSectionMainC'
import { UpsertType } from '@/packages/templates/common/enum/main'

export type ClientUpsertSectionMainProps = {
  type: UpsertType
  projectId: string
}

const ClientUpsertSectionMainS = ({ node, ctx }: any) => {
  return (
    <ClientUpsertSectionMainC type={node.props.type} projectId={ctx.projectId} />
  )
}

export default ClientUpsertSectionMainS