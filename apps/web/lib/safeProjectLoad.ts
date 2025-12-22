
import { ProjectMode, ProjectRuntime, SiteSchema } from "@/packages/schema/src/site-schema";
import { getProjectRuntime, getSiteSchema } from "./project-api";

const FALLBACK_PUBLIC_SCHEMA: SiteSchema = {
  version: "1.0.0",
  layout: { _id: "l-public", type: "layout", layoutKey: "public.default", slots: {} },
  pages: [{ _id: "home", path: "/", kind: "static", blocks: [] }],
};

const FALLBACK_ADMIN_SCHEMA: SiteSchema = {
  version: "1.0.0",
  layout: { _id: "l-admin", type: "layout", layoutKey: "admin.shell", slots: {} },
  pages: [{ _id: "admin", path: "/admin", kind: "static", blocks: [] }],
};

export async function safeLoadProject(projectId: string, mode: ProjectMode): Promise<{
  runtime: ProjectRuntime;
  schema: SiteSchema;
  error?: string;
}> {
  try {
    const [runtime, schema] = await Promise.all([
      getProjectRuntime(projectId, mode),
      getSiteSchema(projectId, mode),
    ]);

    return { runtime, schema };
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    // В production не светим детали; но пусть хотя бы страница не падает
    return {
      runtime: {
        projectId,
        templateId: mode === "admin" ? "admin-shell" : "landing-classic",
        themeId: "default-light",
        seoDefaults: { title: "Error", description: "Failed to load project config" },
      },
      schema: mode === "admin" ? FALLBACK_ADMIN_SCHEMA : FALLBACK_PUBLIC_SCHEMA,
      error: process.env.NODE_ENV === "development" ? msg : "Render failed",
    };
  }
}
