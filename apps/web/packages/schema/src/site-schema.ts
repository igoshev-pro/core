export type ProjectMode = "public" | "admin";

export type ProjectRuntime = {
  projectId: string;
  templateId: string; // which template pack
  themeId: string; // which theme tokens
  locale?: string;
  seoDefaults?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
};

export type SiteSchema = {
  version: string;
  layout: LayoutNode;
  pages: PageNode[];
};

export type LayoutNode = {
  _id: string;
  type: "layout";
  layoutKey: string; // e.g. "public.default" | "admin.shell"
  props?: Record<string, unknown>;
  slots?: {
    header?: BlockNode[];
    footer?: BlockNode[];
    sidebar?: BlockNode[];
  };
};

export type PageNode = {
  _id: string;
  path: string; // "/" "/about" "/blog/[slug]"
  kind: "static" | "dynamic";
  seo?: SeoNode;
  blocks: BlockNode[];
  data?: PageDataBinding;
};

export type BlockNode = SectionNode | WidgetNode;

export type SectionNode = {
  _id: string;
  type: "section";
  key: string; // "hero.v1" "pricing.v2"
  props?: Record<string, unknown>;
  children?: BlockNode[];
  data?: BlockDataBinding;
};

export type WidgetNode = {
  _id: string;
  type: "widget";
  key: string; // "button.v1"
  props?: Record<string, unknown>;
  data?: BlockDataBinding;
};

export type SeoNode = {
  title?: string;
  description?: string;
  index?: boolean;
  canonical?: string;
  ogImage?: string;
};

export type PageDataBinding = {
  source: "collection" | "api";
  ref: string;
  params?: Record<string, unknown>;
};

export type BlockDataBinding = {
  source: "none" | "collection" | "api";
  ref?: string;
  params?: Record<string, unknown>;
};
