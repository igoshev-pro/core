import React from "react";
import { headers } from "next/headers";

import { getProjectRuntime, getSiteSchema } from "@/lib/project-api";
import { ProjectMode } from "@/packages/schema/src/site-schema";
import { matchPage, renderApp, RenderContext } from "@/packages/renderer/src";
import { getTemplatePack } from "@/packages/templates/src";
import { getTheme, themeToCssVars } from "@/packages/themes/src";

import { safeLoadProject } from "@/lib/safeProjectLoad";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

function toAdminPath(slug?: string[]) {
  if (!slug?.length) return "/admin";
  return "/admin/" + slug.join("/");
}

export default async function AdminPage({ params }: PageProps) {
  const { slug } = await params;
  const path = toAdminPath(slug);

  const h = await headers(); // Next 15: headers() async
  const projectId = h.get("x-project-id") ?? "unknown";
  const mode: ProjectMode = "public";

  const { runtime, schema, error } = await safeLoadProject(projectId, mode);
  // const runtime = await getProjectRuntime(projectId, mode);
  // const schema = await getSiteSchema(projectId, mode);

  const matched = matchPage(schema.pages, path);
  if (!matched) {
    return <div style={{ padding: 24 }}>404 admin (no page in schema): {path}</div>;
  }

  const pack = getTemplatePack(runtime.templateId);
  const theme = getTheme(runtime.themeId);

  const ctx: RenderContext = {
    projectId,
    mode,
    runtime,
    schema,
    path,
    params: matched.params,
    theme,
    data: { page: undefined, blocks: {} },
    helpers: {
      assetUrl: (key) => `https://your-s3/${projectId}/${key}`,
      linkTo: (p) => p,
    },
  };

  const cssVars = themeToCssVars(theme);

  if (error) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Server render error</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
      <div>projectId: {projectId}</div>
      <div>mode: {mode}</div>
    </div>
  );
}

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      {renderApp({ layout: schema.layout, page: matched.page, ctx, pack })}
    </>
  );
}
