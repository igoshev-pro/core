import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { CreateProjectDto, Project, UpdateProjectDto } from "../types";

const projectsApi = createCrudApi<Project, CreateProjectDto, UpdateProjectDto>("/api/core/projects");

export const createProject = (body: CreateProjectDto) => projectsApi.create(body);
export const getProjects = (limit?: number, offset?: number) =>
  projectsApi.list({ limit, offset } satisfies PaginationQuery);
export const getProject = (id: string) => projectsApi.get(id);
export const updateProject = (id: string, body: UpdateProjectDto) => projectsApi.update(id, body);
export const removeProject = (id: string) => projectsApi.remove(id);