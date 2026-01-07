export type I18nMap = Record<string, string>;

export type FileObject = {
  path: string;
  contentType?: string;
  size?: number;
};

export type Client = {
  _id: string;
  name: string;
  email: string;
  otp?: string;
  avatarPath?: string | null;
  photos?: unknown[];
  role?: string;
  status?: string;
  sortOrder?: number;
  projects?: string[];
};

export type CreateClientDto = {
  name: string;
  email: string;
  otp?: string;
  avatarPath?: string;
  photos?: unknown[];
};

export type UpdateClientDto = Partial<CreateClientDto> & {
  status?: string;
  sortOrder?: number;
};

export type ProjectTemplate = {
  public?: string;
  admin?: string;
  login?: string;
};

export type ProjectTheme = {
  public?: string;
  admin?: string;
  auth?: string;
};

export type ProjectSeoDefaults = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export type ProjectDbConfig = {
  mongo?: { uri?: string; name?: string };
};

export type ProjectI18nConfig = {
  locales?: string[];
  defaultLocal?: string;
};

export type Project = {
  _id: string;
  domainTech?: string;
  domainCustom?: string | null;
  name: I18nMap;
  i18n?: ProjectI18nConfig;
  previewPath?: string | null;
  gallery?: FileObject[];
  type?: string;
  status?: string;
  owner?: string | Client;
  template?: ProjectTemplate;
  theme?: ProjectTheme;
  seoDefaults?: ProjectSeoDefaults;
  site?: Record<string, unknown>;
  sortOrder?: number;
  db?: ProjectDbConfig;
};

export type CreateProjectDto = {
  domainTech?: string;
  domainCustom?: string;
  name: I18nMap;
  i18n?: ProjectI18nConfig;
  previewPath?: string | null;
  gallery?: unknown[];
  type?: string;
  status?: string;
  owner?: string;
  db?: ProjectDbConfig;
  template?: ProjectTemplate;
  theme?: ProjectTheme;
  seoDefaults?: ProjectSeoDefaults;
  site?: Record<string, unknown>;
};

export type UpdateProjectDto = Partial<CreateProjectDto>;

