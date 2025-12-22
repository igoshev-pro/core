import type { LayoutNode, PageNode, SiteSchema, ProjectRuntime, ProjectMode, BlockNode } from "@/packages/schema/src/site-schema";

export type TemplatePack = {
  _id: string;
  version: string;

  layouts: Record<string, React.ComponentType<any>>;
  sections: Record<string, React.ComponentType<any>>;
  widgets: Record<string, React.ComponentType<any>>;

  // optional: schema migrations
  migrate?: (schema: SiteSchema) => SiteSchema;
};

export type ThemeTokens = {
  _id: string;
  vars: Record<string, string>; // css vars without leading -- OR with, your choice
};

export type RenderContext = {
  projectId: string;
  mode: ProjectMode;
  runtime: ProjectRuntime;
  schema: SiteSchema;

  path: string;
  params: Record<string, string>;

  // resolved theme/tokens
  theme: ThemeTokens;

  // resolved data
  data: {
    page?: unknown;
    blocks?: Record<string, unknown>;
  };

  helpers: {
    assetUrl: (key: string) => string;
    linkTo: (path: string) => string;
  };
};

export type RenderInput = {
  layout: LayoutNode;
  page: PageNode;
  ctx: RenderContext;
  pack: TemplatePack;
};

export type RenderBlockInput = {
  node: BlockNode;
  ctx: RenderContext;
  pack: TemplatePack;
};
