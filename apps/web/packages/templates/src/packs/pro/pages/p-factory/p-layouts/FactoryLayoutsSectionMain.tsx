import EntityCollection from "../../sections/EntityCollection"

const FactoryLayoutsSectionMain = ({ node, ctx }: any) => {
  return (
    <EntityCollection api={node.props.api} />
  )
}

export default FactoryLayoutsSectionMain