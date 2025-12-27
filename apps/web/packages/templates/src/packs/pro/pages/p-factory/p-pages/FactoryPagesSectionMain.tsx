import EntityCollection from "../../sections/EntityCollection"

const FactoryPagesSectionMain = ({ node, ctx }: any) => {
  return (
    <EntityCollection api={node.props.api} ui={node.props?.ui} />
  )
}

export default FactoryPagesSectionMain