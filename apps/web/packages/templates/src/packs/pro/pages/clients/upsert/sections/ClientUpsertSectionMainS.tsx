import ClientUpsertSectionMainC from './ClientUpsertSectionMainC'
import { UpsertType } from '@/packages/templates/common/enum/main'

export type ClientUpsertSectionMainProps = {
  type: UpsertType
}

const ClientUpsertSectionMainS = ({ node, ctx }: any) => {
  console.log(4, node, ctx)
  return (
    <ClientUpsertSectionMainC type={node.props.type} />
  )
}

export default ClientUpsertSectionMainS