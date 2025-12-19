// ===== Types: DB =====

export type DbProject = {
  _id: string;
  url?: string;
  slug?: string;
  name?: string;

  templateId?: string;
  themeId?: string;

  seo?: {
    defaultTitle?: string;
    defaultDescription?: string;
    _id?: string;
  };

  pages?: DbPage[];

  siteSettings?: {
    template?: { name?: string };
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
    };
    fonts?: {
      primary?: string;
      secondary?: string;
    };
    _id?: string;
  };

  // остальное нам сейчас не нужно
};

export type DbPage = {
  path?: string;
  pageType?: string;
  meta?: {
    title?: string;
    description?: string;
  };
  sections?: Array<{
    type: string;
    props?: Record<string, unknown>;
  }>;
};

// ===== Types: Front =====

export type FrontProject = {
  _id: string;
  domain: string;
  templateId: string;
  themeId: string;
  themeOverrides: Record<string, string>;
  seo: {
    defaultTitle: string;
    defaultDescription: string;
  };
  pages: FrontPage[];
};

export type FrontPage = {
  path: string;
  pageType: string;
  meta: {
    title: string;
    description: string;
  };
  sections: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
};

// ===== Mapper =====

export function mapProjectDbToFront(input: DbProject): FrontProject {
  const domain = normalizeDomain(input.url ?? input.slug ?? "localhost");

  const idBase = (input.slug ?? input.url ?? input._id ?? "unknown")
    .toString()
    .trim()
    .replace(/\s+/g, "_");

  const frontId = `project_${idBase}`;

  const templateId = input.templateId ?? "landing-default";
  const themeId = input.themeId ?? "default";

  const themeOverrides = buildThemeOverrides(input);

  const defaultTitleFallback = `${input.name ?? domain} — Платформа`;
  const defaultDescriptionFallback =
    `Проект ${domain}. Отредактируй его схему в админке.`;

  const seo = {
    defaultTitle: nonEmpty(input.seo?.defaultTitle) ?? defaultTitleFallback,
    defaultDescription:
      nonEmpty(input.seo?.defaultDescription) ?? defaultDescriptionFallback,
  };

  const pages = mapPagesOrFallback(input, domain);

  return {
    _id: frontId,
    domain,
    templateId,
    themeId,
    themeOverrides,
    seo,
    pages,
  };
}

// ===== Helpers =====

function buildThemeOverrides(input: DbProject): Record<string, string> {
  const primary = input.siteSettings?.theme?.primaryColor;
  const secondary = input.siteSettings?.theme?.secondaryColor;
  const accent = input.siteSettings?.theme?.accentColor;

  const fontPrimary = input.siteSettings?.fonts?.primary;
  const fontSecondary = input.siteSettings?.fonts?.secondary;

  const overrides: Record<string, string> = {};

  // цвета
  if (nonEmpty(primary)) overrides["--color-primary"] = primary!;
  if (nonEmpty(secondary)) overrides["--color-secondary"] = secondary!;
  if (nonEmpty(accent)) overrides["--color-accent"] = accent!;

  // шрифты (как у тебя в примере: sans/mono)
  if (nonEmpty(fontPrimary)) {
    overrides["--font-sans"] = fontPrimary!;
    overrides["--font-mono"] = fontPrimary!;
  }
  // если хочешь отдельно вторичный — раскомментируй/измени под свой CSS
  // if (nonEmpty(fontSecondary)) overrides["--font-secondary"] = fontSecondary!;

  return overrides;
}

function mapPagesOrFallback(input: DbProject, domain: string): FrontPage[] {
  const pages = input.pages ?? [];

  if (pages.length > 0) {
    return pages.map((p, idx) => ({
      path: nonEmpty(p.path) ?? (idx === 0 ? "/" : `/${idx}`),
      pageType: nonEmpty(p.pageType) ?? "page",
      meta: {
        title: nonEmpty(p.meta?.title) ?? `${input.name ?? domain}`,
        description:
          nonEmpty(p.meta?.description) ?? `Страница проекта ${domain}.`,
      },
      sections: (p.sections ?? []).map((s) => ({
        type: s.type,
        props: (s.props ?? {}) as Record<string, unknown>,
      })),
    }));
  }

  // Фолбэк — ровно в стиле твоего примера
  return [
    {
      path: "/",
      pageType: "landing",
      meta: {
        title: `Главная — ${input.name ?? domain}`,
        description: "Локальный лендинг, собранный из core шаблонов.",
      },
      sections: [
        {
          type: "hero",
          props: {
            title: `Привет, это ${domain} 🔧`,
            subtitle:
              "Этот сайт рендерится из дефолтной JSON-схемы проекта. Подключи backend — и увидишь реальные данные.",
            ctaText: "Это просто кнопка",
            ctaHref: "#",
          },
        },
        {
          type: "services",
          props: {
            title: "Что умеет платформа",
            items: [
              {
                title: "Лендинги",
                description: "Готовые шаблоны для разных ниш.",
              },
              {
                title: "Порталы",
                description: "Каталоги, маркетплейсы, порталы мероприятий.",
              },
              {
                title: "CRM и кабинеты",
                description: "Внутренние панели, кабинеты, CRM.",
              },
            ],
          },
        },
      ],
    },
  ];
}

function normalizeDomain(raw: string): string {
  const v = raw.trim();
  // если пришёл URL типа http(s)://... — вытаскиваем host
  if (/^https?:\/\//i.test(v)) {
    try {
      return new URL(v).host;
    } catch {
      return v;
    }
  }
  return v;
}

function nonEmpty(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v.length > 0 ? v : null;
}
