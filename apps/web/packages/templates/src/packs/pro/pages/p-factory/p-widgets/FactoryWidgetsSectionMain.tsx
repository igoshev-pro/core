import EntityCollection from "../../sections/EntityCollection"

const FactoryWidgetsSectionMain = ({ node, ctx }: any) => {
  return (
    <EntityCollection api={node.props.api} />
  )
}

export default FactoryWidgetsSectionMain