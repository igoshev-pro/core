import React from "react";
import { headers } from "next/headers";

import { getProjectRuntime, getSiteSchema } from "@/lib/project-api";
import type { ProjectMode } from "@/packages/schema/src/site-schema";
import { matchPage, renderApp } from "@/packages/renderer/src";
import type { RenderContext } from "@/packages/renderer/src/types";
import { getTemplatePack } from "@/packages/templates/src";
import { getTheme, themeToCssVars } from "@/packages/themes/src";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

function toAdminPath(slug?: string[]) {
  if (!slug?.length) return "/admin";
  const normalized = slug[0] === "admin" ? slug : ["admin", ...slug];
  return "/" + normalized.join("/");
}

export default async function AdminPage({ params }: PageProps) {
  const { slug } = await params;
  const path = toAdminPath(slug);

  const h = await headers();
  const projectId = h.get("x-project-id") ?? "unknown";
  const mode: ProjectMode = "admin"; // ✅ ВОТ КЛЮЧЕВОЕ

  console.log("x-locales:", h.get("x-locales"));
  console.log("x-default-locale:", h.get("x-default-locale"));
  console.log("x-lang:", h.get("x-lang"));

  const runtime = await getProjectRuntime(projectId, mode);
  const schema = await getSiteSchema(projectId, mode);

  console.log("runtime", runtime);
  console.log("schema:", schema);

  const matched = matchPage(schema.pages, path);
  // if (!matched) {
  //   return (
  //     <div style={{ padding: 24 }}>
  //       <div>404 admin (no page in schema): {path}</div>
  //       <div>slug: {JSON.stringify(slug)}</div>
  //       <div>schema pages: {schema.pages?.map((p) => p.path).join(", ")}</div>
  //     </div>
  //   );
  // }

  if (!matched) {
    notFound(); // ← вот здесь настоящий 404
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      {renderApp({ layout: schema.layout, page: matched.page, ctx, pack })}
    </>
  );
}
