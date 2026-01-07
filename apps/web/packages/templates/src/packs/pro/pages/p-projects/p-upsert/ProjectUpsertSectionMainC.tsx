"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UpsertType } from "@/packages/templates/common/enum/main";
import {
  addToast,
  Button,
  cn,
  Input,
  Select,
  SelectItem,
  Image,
  Textarea,
  Chip,
} from "@heroui/react";
import { MdNoPhotography } from "react-icons/md";
import { IoCamera, IoChevronBack } from "react-icons/io5";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { buildUserPhotoPath, fileExt } from "@/common/helper/photo-path-generator.util";
import { uploadFileToStorage } from "@/api/feature/storageApi";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import { createProject, getProject, updateProject } from "@/api/core/projectsApi";
import { ProjectUpsertSectionMainProps } from "./ProjectUpsertSectionMain";
import { getTemplates } from "@/api/factory/templatesApi";
import { getClients } from "@/api/core/clientsApi";
import { getThemes } from "@/api/factory/themesApi";

import { LoaderModal } from "../../../components/modals/LoaderModal";

// ===================== enums/options =====================
export const StatusEnum = ["draft", "active", "inactive", "archived"] as const;
export type Status = (typeof StatusEnum)[number];

export const LOCALE_OPTIONS = [
  { key: "ru", label: "RU" },
  { key: "en", label: "EN" },
  { key: "de", label: "DE" },
] as const;

export const STATUS_OPTIONS = [
  { key: "draft", label: "Черновик" },
  { key: "active", label: "Активный" },
  { key: "inactive", label: "Не активный" },
  { key: "archived", label: "Архив" },
] as const;

export const TYPE_OPTIONS = [
  { key: "core", label: "Core / База" },
  { key: "landing", label: "Лендинг" },
  { key: "corporate", label: "Корпоративный сайт" },
  { key: "ecommerce", label: "Интернет-магазин" },
  { key: "marketplace", label: "Маркетплейс" },
  { key: "portal", label: "Портал" },
  { key: "service", label: "Онлайн-сервис" },
  { key: "mobile", label: "Мобильное приложение" },
  { key: "cms", label: "CMS" },
  { key: "crm", label: "CRM" },
  { key: "saas", label: "SaaS" },
  { key: "custom", label: "Кастомный проект" },
] as const;

// ===================== types =====================
type I18nString = Record<string, string> | string;

type TemplateItem = { slug: string; name?: I18nString };
type ClientItem = { _id: string; name?: I18nString };
type ThemeItem = { slug: string; name?: I18nString };

// theme: { public, admin, auth }
type ThemePick = {
  public?: string;
  admin?: string;
  auth?: string;
};

// template: { public, admin, login }
type TemplatePick = {
  public?: string; // template _id
  admin?: string; // template _id
  login?: string; // template _id
};

type ApiKind = "projects";
type ExtendedProps = ProjectUpsertSectionMainProps & { api?: ApiKind };

// ===================== helpers =====================
function getI18nLabel(value: I18nString | undefined, locale: string = "ru") {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value["ru"] ?? Object.values(value)[0] ?? "";
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function safeDefaultLocale(locales: string[]) {
  if (!locales?.length) return "ru";
  return locales.includes("ru") ? "ru" : locales[0];
}

// ===================== schema/form =====================
const formSchema = z.object({
  name_ru: z.string().min(2, "Название (RU) минимум 2 символа"),
  name_en: z.string().optional().or(z.literal("")),
  name_de: z.string().optional().or(z.literal("")),
  domainCustom: z.string().min(2, "Домен минимум 2 символа"),

  i18n_locales: z.array(z.string()).min(1, "Выберите хотя бы одну локаль"),
  i18n_defaultLocale: z.string().min(1, "Выберите локаль по умолчанию"),

  type: z.string().min(1, "Выберите тип"),
  status: z
    .string()
    .min(1, "Выберите статус")
    .refine(
      (v): v is Status => (StatusEnum as readonly string[]).includes(v),
      "Выберите статус"
    ),

  owner: z.string().min(1, "Выберите клиента"),

  // ✅ template split
  template_public: z.string().min(1, "Выберите Public template"),
  template_admin: z.string().min(1, "Выберите Admin template"),
  template_login: z.string().min(1, "Выберите Login template"),

  theme_public: z.string().optional().or(z.literal("")),
  theme_admin: z.string().optional().or(z.literal("")),
  theme_auth: z.string().optional().or(z.literal("")),

  seo_title: z.string().optional().or(z.literal("")),
  seo_description: z.string().optional().or(z.literal("")),
  seo_ogImage: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

// ===================== UI blocks =====================
function Section({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-background rounded-4xl p-7 md:p-9", className)}>
      {title ? (
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description ? (
            <p className="text-sm text-foreground-500">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

// ===================== component =====================
export default function ProjectUpsertSectionMainC({
  type,
  projectId,
  id,
  api = "projects",
}: ExtendedProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<any>(null);

  // форс-ремоунт формы (лечит HeroUI Select после reset + async options)
  const [formKey, setFormKey] = useState(0);

  // ---- data lists ----
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [themes, setThemes] = useState<ThemeItem[]>([]);

  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [themesLoading, setThemesLoading] = useState(false);

  const ops = useMemo(() => {
    switch (api) {
      case "projects":
      default:
        return { get: getProject, create: createProject, update: updateProject };
    }
  }, [api]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_ru: "",
      name_en: "",
      name_de: "",
      domainCustom: "",

      i18n_locales: ["ru"],
      i18n_defaultLocale: "ru",

      type: "core",
      status: "draft",

      owner: "",

      template_public: "",
      template_admin: "",
      template_login: "",

      theme_public: "",
      theme_admin: "",
      theme_auth: "",

      seo_title: "",
      seo_description: "",
      seo_ogImage: "",
    },
  });

  // useWatch стабильнее с reset
  const locales = useWatch({ control, name: "i18n_locales" });
  const defaultLocale = useWatch({ control, name: "i18n_defaultLocale" });

  // блокируем “самопочинку” во время проставления данных из API
  const isHydratingRef = useRef(false);

  useEffect(() => {
    if (isHydratingRef.current) return;
    if (!locales?.length) return;
    if (!defaultLocale || !locales.includes(defaultLocale)) {
      setValue("i18n_defaultLocale", locales[0], {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [locales, defaultLocale, setValue]);

  // ===================== load templates/clients/themes =====================
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setTemplatesLoading(true);
      try {
        const data = await getTemplates();
        const normalized =
          Array.isArray(data)
            ? data
                .filter((t) => typeof t?.slug === "string")
                .map((t) => ({ slug: String(t.slug), name: t.name as I18nString | undefined }))
            : [];
        if (!cancelled) setTemplates(normalized);
      } finally {
        if (!cancelled) setTemplatesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setClientsLoading(true);
      try {
        const data = await getClients();
        if (!cancelled) setClients(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setClientsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setThemesLoading(true);
      try {
        const data = await getThemes();
        const normalized =
          Array.isArray(data)
            ? data
                .filter((t) => typeof t?.slug === "string")
                .map((t) => ({ slug: String(t.slug), name: t.name as I18nString | undefined }))
            : [];
        if (!cancelled) setThemes(normalized);
      } finally {
        if (!cancelled) setThemesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const TEMPLATE_OPTIONS = useMemo(
    () =>
      templates.map((t) => ({
        key: t.slug,
        label: getI18nLabel(t.name, "ru") || t.slug,
      })),
    [templates]
  );

  const CLIENT_OPTIONS = useMemo(
    () =>
      clients.map((c) => ({
        key: c._id,
        label: getI18nLabel(c.name, "ru") || c._id,
      })),
    [clients]
  );

  const THEME_OPTIONS = useMemo(
    () =>
      themes.map((t) => ({
        key: t.slug,
        label: getI18nLabel(t.name, "ru") || t.slug,
      })),
    [themes]
  );

  // ✅ ремоунтим форму когда item есть и справочники догрузились
  const hasListsReady =
    templates.length > 0 && clients.length > 0 && themes.length > 0;
  const listsRemountDoneRef = useRef(false);

  useEffect(() => {
    if (!item) return;
    if (!hasListsReady) return;
    if (listsRemountDoneRef.current) return;

    listsRemountDoneRef.current = true;
    setFormKey((k) => k + 1);
  }, [item, hasListsReady]);

  // ===================== avatar (preview) =====================
  const { url: remoteUrl } = usePresignedUrl(item?.previewPath);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = () => inputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const clearPickedFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = async (projectEntityId: string) => {
    if (!file) return;

    try {
      const ext = fileExt(file);
      const path = buildUserPhotoPath({
        projectId,
        userId: projectEntityId,
        kind: "preview",
        ext,
      });

      const uploaded = await uploadFileToStorage({
        projectId,
        file,
        path,
        expiresInSec: 60,
        apiBaseUrl:
          process.env.CORE_API_URL! || "https://api.igoshev.pro/core",
      });

      if (!uploaded) throw new Error("upload failed");

      await ops.update(projectEntityId, {
        previewPath: uploaded.path,
        gallery: [uploaded],
      });

      setItem((prev: any) => ({
        ...(prev ?? {}),
        _id: projectEntityId,
        previewPath: uploaded.path,
        photos: [uploaded],
      }));

      addToast({
        color: "success",
        title: "Успешно!",
        description: "Фото обновлено",
        variant: "solid",
        radius: "lg",
        timeout: 2500,
        shouldShowTimeoutProgress: true,
      });
    } catch {
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: "Произошла ошибка при загрузке файла",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      clearPickedFile();
    }
  };

  const avatarSrc = previewUrl ?? remoteUrl ?? null;

  // ===================== load on edit =====================
  useEffect(() => {
    if (type !== UpsertType.Update || !id) return;

    setLoading(true);
    listsRemountDoneRef.current = false;

    ops
      .get(id)
      .then((res: any) => {
        setItem(res);

        const nameObj =
          res?.name && typeof res.name === "object" ? res.name : {};
        const i18n = res?.i18n ?? {};
        const theme: ThemePick = res?.theme ?? {};
        // ✅ template can be object or legacy string
        const template: TemplatePick | string | undefined = res?.template;

        const seo = res?.seoDefaults ?? {};

        const resLocales: string[] =
          Array.isArray(i18n?.locales) && i18n.locales.length
            ? i18n.locales
            : ["ru"];

        const resDefaultLocale: string =
          i18n?.defaultLocale ?? safeDefaultLocale(resLocales);

        // ✅ template normalize
        const templateObj: TemplatePick =
          template && typeof template === "object"
            ? template
            : { public: (template as string) || "" };

        isHydratingRef.current = true;

        reset(
          {
            name_ru: nameObj?.ru ?? "",
            name_en: nameObj?.en ?? "",
            name_de: nameObj?.de ?? "",
            domainCustom: res?.domainCustom ?? "",

            i18n_locales: resLocales,
            i18n_defaultLocale: resDefaultLocale,

            type: res?.type ?? "core",
            status: res?.status ?? "draft",

            owner: res?.owner?._id ?? res?.owner ?? "",

            // ✅ new fields
            template_public: templateObj?.public ?? "",
            template_admin: templateObj?.admin ?? "",
            template_login: templateObj?.login ?? "",

            theme_public: theme?.public ?? "",
            theme_admin: theme?.admin ?? "",
            theme_auth: theme?.auth ?? "",

            seo_title: seo?.title ?? "",
            seo_description: seo?.description ?? "",
            seo_ogImage: seo?.ogImage ?? "",
          },
          { keepDirty: false, keepTouched: false }
        );

        setFormKey((k) => k + 1);

        queueMicrotask(() => {
          isHydratingRef.current = false;
        });
      })
      .catch(() => {
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Не удалось загрузить проект",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      })
      .finally(() => setLoading(false));
  }, [type, id, ops, reset]);

  // ===================== submit =====================
  const onSubmit = async (data: FormData) => {
    const name: Record<string, string> = {};
    if (data.name_ru?.trim()) name.ru = data.name_ru.trim();
    if (data.name_en?.trim()) name.en = data.name_en.trim();
    if (data.name_de?.trim()) name.de = data.name_de.trim();

    const payload: any = {
      name,
      domainCustom: data.domainCustom?.trim(),
      i18n: {
        locales: uniq(data.i18n_locales),
        defaultLocale: data.i18n_defaultLocale,
      },
      type: data.type,
      status: data.status,
      owner: data.owner,

      // ✅ NEW: template object (3 values)
      template: {
        public: data.template_public,
        admin: data.template_admin,
        login: data.template_login,
      },

      theme: {
        public: data.theme_public || undefined,
        admin: data.theme_admin || undefined,
        auth: data.theme_auth || undefined,
      },
      seoDefaults: {
        title: data.seo_title || undefined,
        description: data.seo_description || undefined,
        ogImage: data.seo_ogImage || undefined,
      },
    };

    if (!payload.i18n.locales.includes(payload.i18n.defaultLocale)) {
      payload.i18n.defaultLocale = payload.i18n.locales[0];
    }

    if (type === UpsertType.Create) {
      setLoading(true);
      try {
        const created = await ops.create(payload);
        if (file && created?._id) await upload(created._id);

        addToast({
          color: "success",
          title: "Успешно!",
          description: "Проект создан успешно",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        router.push(`/admin/core/projects`);
      } catch {
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Произошла ошибка при создании проекта",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === UpsertType.Update && id) {
      setLoading(true);
      try {
        await ops.update(id, payload);
        if (file) await upload(id);

        addToast({
          color: "success",
          title: "Успешно!",
          description: "Данные сохранены",
          variant: "solid",
          radius: "lg",
          timeout: 2500,
          shouldShowTimeoutProgress: true,
        });

        setItem((prev: any) => ({ ...(prev ?? {}), ...payload }));
        reset(getValues(), { keepDirty: false, keepTouched: false });
      } catch {
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Произошла ошибка при сохранении",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const canSave = type === UpsertType.Update ? (isDirty || !!file) : true;

  return (
    <>
      {loading ? <LoaderModal /> : null}

      <div className="flex items-center gap-6 mb-9">
        <Button isIconOnly radius="full" onPress={() => router.back()}>
          <IoChevronBack className="text-[20px]" />
        </Button>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold leading-tight">
            {type === UpsertType.Create ? "Создание проекта" : "Редактирование проекта"}
          </h1>
          {type === UpsertType.Update ? (
            <p className="text-sm text-foreground-500 mt-1">
              {item?.name?.ru ? (
                <>
                  Текущие данные:{" "}
                  <span className="text-primary font-medium">{item?.name?.ru}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>

      <form
        key={formKey}
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left: preview */}
        <Section title="" className="lg:col-span-1 !bg-transparent !p-0 !md:p-0">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
            <div
              className={cn("absolute inset-0", {
                ["bg-background flex items-center justify-center"]: !avatarSrc,
              })}
            >
              {avatarSrc ? (
                <Image
                  alt="Preview"
                  src={avatarSrc}
                  radius="none"
                  removeWrapper
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="flex flex-col gap-3 h-full w-full items-center justify-center text-foreground-500">
                  <MdNoPhotography className="text-[36px]" />
                  <p className="text-xs">Фото не загружено</p>
                </div>
              )}

              <Button
                className="absolute bottom-3 right-3 z-10"
                color="primary"
                radius="full"
                isIconOnly
                onPress={() => inputRef.current?.click()}
                type="button"
              >
                <IoCamera className="text-[20px] min-w-[20px] mx-[2px]" />
              </Button>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </div>
        </Section>

        {/* Middle+Right */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Section title="Основное" description="Базовые данные проекта.">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Название проекта</p>
                  <Chip variant="flat" size="sm">
                    i18n
                  </Chip>
                </div>

                <Grid2>
                  <Input
                    label="RU"
                    placeholder="Название на русском"
                    size="lg"
                    isInvalid={Boolean(errors.name_ru)}
                    errorMessage={errors.name_ru?.message}
                    {...register("name_ru")}
                  />

                  <Input
                    label="EN"
                    placeholder="Name in English (optional)"
                    size="lg"
                    isInvalid={Boolean(errors.name_en)}
                    errorMessage={errors.name_en?.message}
                    {...register("name_en")}
                  />

                  <Input
                    label="DE"
                    placeholder="Name auf Deutsch (optional)"
                    size="lg"
                    isInvalid={Boolean(errors.name_de)}
                    errorMessage={errors.name_de?.message}
                    {...register("name_de")}
                  />

                  <Input
                    label="Домен"
                    placeholder="example.com"
                    size="lg"
                    isInvalid={Boolean(errors.domainCustom)}
                    errorMessage={errors.domainCustom?.message}
                    {...register("domainCustom")}
                  />
                </Grid2>
              </div>

              <Grid2>
                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Тип"
                      selectedKeys={field.value ? new Set([field.value]) : new Set()}
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0] as string)
                      }
                      onBlur={field.onBlur}
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Статус"
                      selectedKeys={field.value ? new Set([field.value]) : new Set()}
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0] as string)
                      }
                      onBlur={field.onBlur}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </Grid2>
            </div>
          </Section>

          <Section title="Локализация" description="Выбери набор локалей проекта и локаль по умолчанию.">
            <Grid2>
              <Controller
                name="i18n_locales"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Локали"
                    selectionMode="multiple"
                    selectedKeys={new Set(field.value ?? [])}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys).map(String))
                    }
                    onBlur={field.onBlur}
                    renderValue={(items) => (
                      <div className="flex flex-wrap gap-2">
                        {items.map((it) => (
                          <Chip key={it.key} variant="flat" size="sm">
                            {String(it.key).toUpperCase()}
                          </Chip>
                        ))}
                      </div>
                    )}
                  >
                    {LOCALE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="i18n_defaultLocale"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Локаль по умолчанию"
                    selectedKeys={field.value ? new Set([field.value]) : new Set()}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    isDisabled={!locales?.length}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0] as string)
                    }
                    onBlur={field.onBlur}
                  >
                    {(locales?.length ? locales : ["ru"]).map((l) => (
                      <SelectItem key={l}>{l.toUpperCase()}</SelectItem>
                    ))}
                  </Select>
                )}
              />
            </Grid2>
          </Section>

          <Section title="Привязки" description="Клиент, templates и themes.">
            <div className="flex flex-col gap-6">
              <Grid2>
                <Controller
                  name="owner"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Клиент (Owner)"
                      selectedKeys={field.value ? new Set([field.value]) : new Set()}
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      isDisabled={clientsLoading}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0] as string)
                      }
                      onBlur={field.onBlur}
                    >
                      {CLIENT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />

                {/* spacer */}
                <div className="hidden md:block" />
              </Grid2>

              {/* ✅ TEMPLATES (3 selects) */}
              <div className="flex flex-col gap-3">
                <p className="font-medium">Templates</p>
                <Grid2>
                  <Controller
                    name="template_public"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Public"
                        selectedKeys={field.value ? new Set([field.value]) : new Set()}
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        isDisabled={templatesLoading}
                        onSelectionChange={(keys) =>
                          field.onChange((Array.from(keys)[0] as string) ?? "")
                        }
                        onBlur={field.onBlur}
                      >
                        {TEMPLATE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="template_admin"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Admin"
                        selectedKeys={field.value ? new Set([field.value]) : new Set()}
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        isDisabled={templatesLoading}
                        onSelectionChange={(keys) =>
                          field.onChange((Array.from(keys)[0] as string) ?? "")
                        }
                        onBlur={field.onBlur}
                      >
                        {TEMPLATE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="template_login"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Login"
                        selectedKeys={field.value ? new Set([field.value]) : new Set()}
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        isDisabled={templatesLoading}
                        onSelectionChange={(keys) =>
                          field.onChange((Array.from(keys)[0] as string) ?? "")
                        }
                        onBlur={field.onBlur}
                      >
                        {TEMPLATE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid2>
                <p className="text-xs text-foreground-500">
                  Значения сохраняются как <span className="font-mono">template._id</span>.
                </p>
              </div>

              {/* THEMES (3 selects) */}
              <div className="flex flex-col gap-3">
                <p className="font-medium">Themes</p>
                <Grid2>
                  <Controller
                    name="theme_public"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Public"
                        selectedKeys={field.value ? new Set([field.value]) : new Set()}
                        isDisabled={themesLoading}
                        onSelectionChange={(keys) =>
                          field.onChange((Array.from(keys)[0] as string) ?? "")
                        }
                        onBlur={field.onBlur}
                      >
                        {THEME_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="theme_admin"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Admin"
                        selectedKeys={field.value ? new Set([field.value]) : new Set()}
                        isDisabled={themesLoading}
                        onSelectionChange={(keys) =>
                          field.onChange((Array.from(keys)[0] as string) ?? "")
                        }
                        onBlur={field.onBlur}
                      >
                        {THEME_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="theme_auth"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Auth"
                        selectedKeys={field.value ? new Set([field.value]) : new Set()}
                        isDisabled={themesLoading}
                        onSelectionChange={(keys) =>
                          field.onChange((Array.from(keys)[0] as string) ?? "")
                        }
                        onBlur={field.onBlur}
                      >
                        {THEME_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid2>
                <p className="text-xs text-foreground-500">
                  Значения сохраняются как <span className="font-mono">slug</span>.
                </p>
              </div>
            </div>
          </Section>

          <Section
            title="SEO по умолчанию"
            description="Будет использоваться, если на страницах не задано своё."
          >
            <div className="flex flex-col gap-6">
              <Input label="Title" placeholder="SEO Title" size="lg" {...register("seo_title")} />
              <Textarea
                label="Description"
                placeholder="SEO Description"
                minRows={4}
                {...register("seo_description")}
              />
              <Input label="OG Image" placeholder="https://..." size="lg" {...register("seo_ogImage")} />
            </div>
          </Section>

          <div className="flex justify-end">
            <Button
              color="primary"
              size="lg"
              radius="full"
              isLoading={isSubmitting}
              isDisabled={!canSave}
              type="submit"
            >
              {type === UpsertType.Create ? "Создать" : "Сохранить"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
