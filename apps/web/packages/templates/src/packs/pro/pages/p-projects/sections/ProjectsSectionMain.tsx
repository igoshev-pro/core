import EntityCollection from "../../sections/EntityCollection";

export default function ProjectsSectionMain({ node, ctx }: any) {
    return (
        <EntityCollection api={node.props.api} ui={node.props.ui} />
    );
}
