import EntityCollection from "../../sections/EntityCollection"

const FactoryThemesSectionMain = ({ node, ctx }: any) => {
  return (
    <EntityCollection api={node.props.api} />
  )
}

export default FactoryThemesSectionMain