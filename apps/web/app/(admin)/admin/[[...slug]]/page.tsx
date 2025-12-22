import { headers } from "next/headers";
import { ProjectMode } from "@/packages/schema/src/site-schema";
import { matchPage, renderApp, RenderContext } from "@/packages/renderer/src";
import { getTemplatePack } from "@/packages/templates/src";
import { getTheme, themeToCssVars } from "@/packages/themes/src";
import { getProjectRuntime, getSiteSchema } from "@/lib/project-api";

function toAdminPath(slug?: string[]) {
  if (!slug?.length) return "/admin";
  return "/admin/" + slug.join("/");
}

export default async function AdminPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const path = toAdminPath(params.slug);

  const h = headers();
  // @ts-ignore
  const projectId = h.get("x-project-id") ?? "unknown";
  const mode: ProjectMode = "admin";

  const runtime = await getProjectRuntime(projectId, mode);
  const schema = await getSiteSchema(projectId, mode);

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      {renderApp({ layout: schema.layout, page: matched.page, ctx, pack })}
    </>
  );
}
