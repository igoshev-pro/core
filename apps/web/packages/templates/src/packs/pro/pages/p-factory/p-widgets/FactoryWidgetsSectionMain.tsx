import EntityCollection from "../../sections/EntityCollection"

const FactoryWidgetSectionMain = ({ node, ctx }: any) => {
  return (
    <EntityCollection api={node.props.api} />
  )
}

export default FactoryWidgetSectionMain