export type OptionType = {
	key: string;
	label: string;
};

export enum ProjectStatus {
  Active = "active",
  Inactive = "inactive",
  Draft = "draft",
  Archived = "archived",
}

export enum ProjectType {
  Core = "core",
  Landing = "landing",
  Corporate = "corporate",
  Ecommerce = "ecommerce",
  Marketplace = "marketplace",
  Portal = "portal",
  Service = "service",
  Mobile = "mobile",
  Cms = "cms",
  Crm = "crm",
  Saas = "saas",
  Custom = "custom",
}

export enum ProjectModule {
  Dashboard = "dashboard",
  Projects = "projects",
  Users = "users",
  Crm = "crm",
  Cms = "cms",
  Analytics = "analytics",
  Settings = "settings",
  Cloud = "cloud",
  Hosting = "hosting",
}

export const projectStatusOptions: OptionType[] = [
  { key: "active", label: "Активен" },
  { key: "inactive", label: "Неактивен" },
  { key: "draft", label: "Черновик" },
  { key: "archived", label: "Архивирован" },
];

export const projectTypeOptions: OptionType[] = [
  { key: "core", label: "Ядро" },
  { key: "landing", label: "Лендинг" },
  { key: "corporate", label: "Корпоративный сайт" },
  { key: "ecommerce", label: "Интернет-магазин" },
  { key: "marketplace", label: "Маркетплейс" },
  { key: "portal", label: "Информационный портал" },
  { key: "service", label: "Сервис" },
  { key: "mobile", label: "Мобильное приложение" },
  { key: "cms", label: "Админка CMS" },
  { key: "crm", label: "CRM система" },
  { key: "saas", label: "SaaS платформа" },
  { key: "custom", label: "Индивидуальный проект" },
];

export const projectModuleOptions: OptionType[] = [
  { key: "dashboard", label: "Дашборд" },
  { key: "projects", label: "Проекты" },
  { key: "users", label: "Пользователи" },
  { key: "crm", label: "Заявки CRM Lite" },
  { key: "cms", label: "Админка CMS" },
  { key: "analytics", label: "Аналитика" },
  { key: "settings", label: "Настройки" },
  { key: "cloud", label: "Cloud" },
  { key: "hosting", label: "Хостинг" },
];
