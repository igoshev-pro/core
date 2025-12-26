import EntityCollection from "../../sections/EntityCollection"

const FactoryTemplatesSectionMain = ({ node, ctx }: any) => {
  return (
    <EntityCollection api={node.props.api} />
  )
}

export default FactoryTemplatesSectionMain