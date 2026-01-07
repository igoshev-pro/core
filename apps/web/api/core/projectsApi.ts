import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { CreateProjectDto, Project, UpdateProjectDto } from "../types";

// ===================== SiteSchema API =====================

export type SiteLayout = {
  _id: string;
  type: string;
  layoutKey: string;
  slots?: Record<string, any[]>;
};

export type SiteBlock = {
  _id: string;
  type: 'widget' | 'section';
  key: string;
  props: any;
};

export type PageAccess = {
  auth?: boolean;
  roles?: string[];
  features?: string[];
  redirectTo?: string;
  permissions?: string[];
  all?: boolean;
  hideInMenuIfNoAccess?: boolean;
};

export type SitePage = {
  _id: string;
  name: string;
  path: string;
  kind: 'static' | 'dynamic';
  access?: PageAccess;
  blocks: SiteBlock[];
};

export type SiteMenuItem = {
  _id: string;
  label: Record<string, string>; // i18n: { ru: "Главная", en: "Home", de: "Startseite" }
  order: number;
  linkType: 'internal' | 'external';
  pagePath?: string; // если linkType === 'internal', путь страницы из pages (например, "/about")
  externalUrl?: string; // если linkType === 'external', внешняя ссылка
  parentId?: string; // иерархия - ID родительского пункта меню
  icon?: string; // опционально: иконка
  iconSize?: string; // опционально: размер иконки (например, "24px", "1.5rem")
};

export type SiteSchemaSection = {
  version?: string;
  layout: SiteLayout;
  pages: SitePage[];
  menu?: SiteMenuItem[]; // меню сайта
};

export type ProjectSiteSchema = {
  public: SiteSchemaSection;
  admin: SiteSchemaSection;
  login: SiteSchemaSection;
};

const projectsApi = createCrudApi<Project, CreateProjectDto, UpdateProjectDto>("/api/core/projects");

export const createProject = (body: CreateProjectDto) => projectsApi.create(body);
export const getProjects = (limit?: number, offset?: number) =>
  projectsApi.list({ limit, offset } satisfies PaginationQuery);
export const getProject = (id: string) => projectsApi.get(id);
export const updateProject = (id: string, body: UpdateProjectDto) => projectsApi.update(id, body);
export const removeProject = (id: string) => projectsApi.remove(id);

export async function getSiteSchema(projectId: string): Promise<ProjectSiteSchema> {
  const res = await fetch(`/api/core/projects/${projectId}/site-schema`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch site schema');
  return res.json();
}

export async function updateSiteSchema(
  projectId: string,
  data: Partial<ProjectSiteSchema>
): Promise<ProjectSiteSchema> {
  const res = await fetch(`/api/core/projects/${projectId}/site-schema`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update site schema');
  return res.json();
}

export async function updateSiteSchemaSection(
  projectId: string,
  mode: 'public' | 'admin' | 'login',
  section: SiteSchemaSection
): Promise<SiteSchemaSection> {
  const res = await fetch(`/api/core/projects/${projectId}/site-schema/${mode}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(section),
  });
  if (!res.ok) throw new Error('Failed to update site schema section');
  return res.json();
}