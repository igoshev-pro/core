import React from "react";
import type { LayoutNode, BlockNode } from "@/packages/schema/src/site-schema";
import type { RenderInput, RenderBlockInput } from "./types";

function Unknown({ kind, key }: { kind: string; key: string }) {
  return (
    <div style={{ border: "1px dashed #999", padding: 12, borderRadius: 8 }}>
      <div style={{ fontWeight: 600 }}>Unknown {kind}</div>
      <div>{key}</div>
    </div>
  );
}

export function renderBlock({ node, ctx, pack }: RenderBlockInput): React.ReactNode {
  if (node.type === "section") {
    const Comp = pack.sections[node.key];
    const children = node.children?.map((child) => (
      <React.Fragment key={child._id}>{renderBlock({ node: child, ctx, pack })}</React.Fragment>
    ));

    if (!Comp) return <Unknown kind="section" key={node.key} />;
    return <Comp node={node} ctx={ctx}>{children}</Comp>;
  }

  if (node.type === "widget") {
    const Comp = pack.widgets[node.key];
    if (!Comp) return <Unknown kind="widget" key={node.key} />;
    return <Comp node={node} ctx={ctx} />;
  }

  return <Unknown kind="block" key={"unknown"} />;
}

function renderSlot(nodes: BlockNode[] | undefined, ctx: RenderInput["ctx"], pack: RenderInput["pack"]) {
  if (!nodes?.length) return null;
  return nodes.map((n) => <React.Fragment key={n._id}>{renderBlock({ node: n, ctx, pack })}</React.Fragment>);
}

export function renderApp({ layout, page, ctx, pack }: RenderInput): React.ReactNode {
  const LayoutComp = pack.layouts[layout.layoutKey];
  if (!LayoutComp) return <Unknown kind="layout" key={layout.layoutKey} />;

  const header = renderSlot(layout.slots?.header, ctx, pack);
  const footer = renderSlot(layout.slots?.footer, ctx, pack);
  const sidebar = renderSlot(layout.slots?.sidebar, ctx, pack);

  const main = page.blocks.map((b) => (
    <React.Fragment key={b._id}>{renderBlock({ node: b, ctx, pack })}</React.Fragment>
  ));

  return (
    <LayoutComp layout={layout} page={page} ctx={ctx} slots={{ header, footer, sidebar }}>
      {main}
    </LayoutComp>
  );
}
