"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UpsertType } from "@/packages/templates/common/enum/main";
import { addToast, Button, cn, Input, Image, Textarea } from "@heroui/react";
import { MdNoPhotography } from "react-icons/md";
import { IoCamera, IoChevronBack } from "react-icons/io5";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { buildUserPhotoPath, fileExt } from "@/common/helper/photo-path-generator.util";
import { uploadFileToStorage } from "@/api/feature/storageApi";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import { getProject, updateProject } from "@/api/core/projectsApi";

import { LoaderModal } from "../../../components/modals/LoaderModal";

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

// ===================== helpers =====================
type I18n3 = { ru?: string; en?: string; de?: string };

function buildI18n3(ru?: string, en?: string, de?: string): I18n3 | undefined {
  const obj: I18n3 = {};
  if (ru?.trim()) obj.ru = ru.trim();
  if (en?.trim()) obj.en = en.trim();
  if (de?.trim()) obj.de = de.trim();
  return Object.keys(obj).length ? obj : undefined;
}

function parseNumberOrUndef(v: string | undefined) {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

// ===================== schema =====================
const urlOrEmpty = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https?:\/\/.+/i.test(v), "Введите корректный URL (https://...)");

const phoneRu = z
  .string()
  .trim()
  .regex(/^\+7\d{10}$/, "Телефон должен быть в формате +7XXXXXXXXXX");

const formSchema = z.object({
  // ✅ companyName i18n
  companyName_ru: z.string().min(2, "Название (RU) минимум 2 символа"),
  companyName_en: z.string().optional().or(z.literal("")),
  companyName_de: z.string().optional().or(z.literal("")),

  // paths (редактируются через upload кнопки)
  companyLogoPath: z.string().optional().or(z.literal("")),
  companyLogoDarkPath: z.string().optional().or(z.literal("")),
  companyLogoAltPath: z.string().optional().or(z.literal("")), // ✅ NEW
  faviconPath: z.string().optional().or(z.literal("")),

  // ✅ seo title i18n
  seo_title_ru: z.string().optional().or(z.literal("")),
  seo_title_en: z.string().optional().or(z.literal("")),
  seo_title_de: z.string().optional().or(z.literal("")),

  // ✅ seo description i18n
  seo_description_ru: z.string().optional().or(z.literal("")),
  seo_description_en: z.string().optional().or(z.literal("")),
  seo_description_de: z.string().optional().or(z.literal("")),

  seo_ogImage: urlOrEmpty,

  // address
  address_country: z.string().optional().or(z.literal("")),
  address_region: z.string().optional().or(z.literal("")),
  address_city: z.string().optional().or(z.literal("")),
  address_street: z.string().optional().or(z.literal("")),
  address_house: z.string().optional().or(z.literal("")),
  address_postalCode: z.string().optional().or(z.literal("")),
  address_placeId: z.string().optional().or(z.literal("")),
  address_lat: z.string().optional().or(z.literal("")),
  address_lng: z.string().optional().or(z.literal("")),

  // socials
  instagram: urlOrEmpty,
  facebook: urlOrEmpty,
  vk: urlOrEmpty,

  // contacts
  telegram: z.string().optional().or(z.literal("")),
  whatsApp: z.string().optional().or(z.literal("")),

  // analytics
  ga4Id: z.string().optional().or(z.literal("")),
  ymId: z.string().optional().or(z.literal("")),
  metaPixelId: z.string().optional().or(z.literal("")),

  emails: z.array(z.object({ value: z.string().email("Некорректный email") })).optional(),
  phones: z.array(z.object({ value: phoneRu })).optional(),
});

type FormData = z.infer<typeof formSchema>;

// ===================== component =====================
type Props = {
  type: UpsertType;
  projectId: string; // общий projectId как в твоём коде
  id?: string; // entityId проекта
};

export default function ProjectSiteSettingsEditPage({ type, projectId, id }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [formKey, setFormKey] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName_ru: "",
      companyName_en: "",
      companyName_de: "",

      companyLogoPath: "",
      companyLogoDarkPath: "",
      companyLogoAltPath: "", // ✅ NEW
      faviconPath: "",

      seo_title_ru: "",
      seo_title_en: "",
      seo_title_de: "",

      seo_description_ru: "",
      seo_description_en: "",
      seo_description_de: "",

      seo_ogImage: "",

      address_country: "",
      address_region: "",
      address_city: "",
      address_street: "",
      address_house: "",
      address_postalCode: "",
      address_placeId: "",
      address_lat: "",
      address_lng: "",

      instagram: "",
      facebook: "",
      vk: "",

      telegram: "",
      whatsApp: "",

      ga4Id: "",
      ymId: "",
      metaPixelId: "",

      emails: [{ value: "" }],
      phones: [{ value: "+7" }],
    },
  });

  const phonesFA = useFieldArray({ control, name: "phones" });
  const emailsFA = useFieldArray({ control, name: "emails" });

  // ===================== settings + presigned =====================
  const settings = (item?.settings ?? item?.project?.settings ?? {}) as any;

  const { url: logoRemoteUrl } = usePresignedUrl(settings?.companyLogoPath);
  const { url: logoDarkRemoteUrl } = usePresignedUrl(settings?.companyLogoDarkPath);
  const { url: logoAltRemoteUrl } = usePresignedUrl(settings?.companyLogoAltPath); // ✅ NEW
  const { url: faviconRemoteUrl } = usePresignedUrl(settings?.faviconPath);

  // ===================== uploads refs + state =====================
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const logoDarkInputRef = useRef<HTMLInputElement | null>(null);
  const logoAltInputRef = useRef<HTMLInputElement | null>(null); // ✅ NEW
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoDarkFile, setLogoDarkFile] = useState<File | null>(null);
  const [logoAltFile, setLogoAltFile] = useState<File | null>(null); // ✅ NEW
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoDarkPreviewUrl, setLogoDarkPreviewUrl] = useState<string | null>(null);
  const [logoAltPreviewUrl, setLogoAltPreviewUrl] = useState<string | null>(null); // ✅ NEW
  const [faviconPreviewUrl, setFaviconPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!logoFile) return;
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  useEffect(() => {
    if (!logoDarkFile) return;
    const url = URL.createObjectURL(logoDarkFile);
    setLogoDarkPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoDarkFile]);

  useEffect(() => {
    if (!logoAltFile) return;
    const url = URL.createObjectURL(logoAltFile);
    setLogoAltPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoAltFile]);

  useEffect(() => {
    if (!faviconFile) return;
    const url = URL.createObjectURL(faviconFile);
    setFaviconPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [faviconFile]);

  const logoSrc = logoPreviewUrl ?? logoRemoteUrl ?? null;
  const logoDarkSrc = logoDarkPreviewUrl ?? logoDarkRemoteUrl ?? null;
  const logoAltSrc = logoAltPreviewUrl ?? logoAltRemoteUrl ?? null; // ✅ NEW
  const faviconSrc = faviconPreviewUrl ?? faviconRemoteUrl ?? null;

  const clearLogoPicked = () => {
    setLogoFile(null);
    setLogoPreviewUrl(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const clearLogoDarkPicked = () => {
    setLogoDarkFile(null);
    setLogoDarkPreviewUrl(null);
    if (logoDarkInputRef.current) logoDarkInputRef.current.value = "";
  };

  const clearLogoAltPicked = () => {
    setLogoAltFile(null);
    setLogoAltPreviewUrl(null);
    if (logoAltInputRef.current) logoAltInputRef.current.value = "";
  };

  const clearFaviconPicked = () => {
    setFaviconFile(null);
    setFaviconPreviewUrl(null);
    if (faviconInputRef.current) faviconInputRef.current.value = "";
  };

  /**
   * ✅ buildUserPhotoPath(kind) принимает только: "avatar" | "photo" | "preview"
   * Поэтому для логотипов/фавикона используем kind="photo"
   * и делаем namespace через userId: `${id}__companyLogo` / `${id}__companyLogoDark` / `${id}__companyLogoAlt` / `${id}__favicon`
   */
  const uploadToSettings = async (
    projectEntityId: string,
    kind: "companyLogo" | "companyLogoDark" | "companyLogoAlt" | "favicon",
    file: File
  ) => {
    const ext = fileExt(file);

    const namespace =
      kind === "companyLogo"
        ? "companyLogo"
        : kind === "companyLogoDark"
        ? "companyLogoDark"
        : kind === "companyLogoAlt"
        ? "companyLogoAlt"
        : "favicon";

    const path = buildUserPhotoPath({
      projectId,
      userId: `${projectEntityId}__${namespace}`,
      kind: "photo",
      ext,
    });

    const uploaded = await uploadFileToStorage({
      projectId,
      file,
      path,
      expiresInSec: 60,
      apiBaseUrl: process.env.CORE_API_URL! || "https://api.igoshev.pro/core",
    });

    if (!uploaded) throw new Error("upload failed");

    const prevSettings = (item?.settings ?? item?.project?.settings ?? {}) as any;

    const nextSettings = {
      ...prevSettings,
      ...(kind === "companyLogo" ? { companyLogoPath: uploaded.path } : {}),
      ...(kind === "companyLogoDark" ? { companyLogoDarkPath: uploaded.path } : {}),
      ...(kind === "companyLogoAlt" ? { companyLogoAltPath: uploaded.path } : {}),
      ...(kind === "favicon" ? { faviconPath: uploaded.path } : {}),
    };

    await updateProject(projectEntityId, { settings: nextSettings });

    setItem((prev: any) => ({
      ...(prev ?? {}),
      _id: projectEntityId,
      settings: nextSettings,
    }));

    addToast({
      color: "success",
      title: "Успешно!",
      description:
        kind === "companyLogo"
          ? "Логотип обновлён"
          : kind === "companyLogoDark"
          ? "Dark-логотип обновлён"
          : kind === "companyLogoAlt"
          ? "Альтернативный логотип обновлён"
          : "Favicon обновлён",
      variant: "solid",
      radius: "lg",
      timeout: 2500,
      shouldShowTimeoutProgress: true,
    });
  };

  // ===================== load =====================
  useEffect(() => {
    if (type !== UpsertType.Update || !id) return;

    setLoading(true);

    getProject(id)
      .then((res: any) => {
        setItem(res);

        const s = (res?.settings ?? res?.project?.settings ?? {}) as any;

        const companyName = (s?.companyName ?? {}) as I18n3;
        const seo = (s?.seoDefaults ?? {}) as any;
        const seoTitle = (seo?.title ?? {}) as I18n3;
        const seoDesc = (seo?.description ?? {}) as I18n3;

        const address = (s?.address ?? {}) as any;
        const geo = (address?.geo ?? {}) as any;

        const social = (s?.socialLinks ?? {}) as any;
        const contacts = (s?.contacts ?? {}) as any;
        const analytics = (s?.analytics ?? {}) as any;

        reset(
          {
            companyName_ru: companyName?.ru ?? "",
            companyName_en: companyName?.en ?? "",
            companyName_de: companyName?.de ?? "",

            companyLogoPath: s?.companyLogoPath ?? "",
            companyLogoDarkPath: s?.companyLogoDarkPath ?? "",
            companyLogoAltPath: s?.companyLogoAltPath ?? "",
            faviconPath: s?.faviconPath ?? "",

            seo_title_ru: seoTitle?.ru ?? "",
            seo_title_en: seoTitle?.en ?? "",
            seo_title_de: seoTitle?.de ?? "",

            seo_description_ru: seoDesc?.ru ?? "",
            seo_description_en: seoDesc?.en ?? "",
            seo_description_de: seoDesc?.de ?? "",

            seo_ogImage: seo?.ogImage ?? "",

            address_country: address?.country ?? "",
            address_region: address?.region ?? "",
            address_city: address?.city ?? "",
            address_street: address?.street ?? "",
            address_house: address?.house ?? "",
            address_postalCode: address?.postalCode ?? "",
            address_placeId: address?.placeId ?? "",

            address_lat: geo?.lat != null ? String(geo.lat) : "",
            address_lng: geo?.lng != null ? String(geo.lng) : "",

            instagram: social?.instagram ?? "",
            facebook: social?.facebook ?? "",
            vk: social?.vk ?? "",

            telegram: contacts?.telegram ?? "",
            whatsApp: contacts?.whatsApp ?? "",

            ga4Id: analytics?.ga4Id ?? "",
            ymId: analytics?.ymId ?? "",
            metaPixelId: analytics?.metaPixelId ?? "",

            emails: (contacts?.emails ?? [""]).map((e: string) => ({ value: e })),
            phones: (contacts?.phones ?? ["+7"]).map((p: string) => ({ value: p })),
          },
          { keepDirty: false, keepTouched: false }
        );

        setFormKey((k) => k + 1);
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
  }, [type, id, reset]);

  // ===================== submit =====================
  const onSubmit = async (data: FormData) => {
    if (!id) return;

    const nextSettings = {
      ...(item?.settings ?? {}),

      companyName: buildI18n3(data.companyName_ru, data.companyName_en, data.companyName_de),

      // paths сохраняются через uploadToSettings
      companyLogoPath: (item?.settings?.companyLogoPath ?? data.companyLogoPath) || undefined,
      companyLogoDarkPath: (item?.settings?.companyLogoDarkPath ?? data.companyLogoDarkPath) || undefined,
      companyLogoAltPath: (item?.settings?.companyLogoAltPath ?? data.companyLogoAltPath) || undefined,
      faviconPath: (item?.settings?.faviconPath ?? data.faviconPath) || undefined,

      seoDefaults: {
        title: buildI18n3(data.seo_title_ru, data.seo_title_en, data.seo_title_de) ?? {},
        description: buildI18n3(data.seo_description_ru, data.seo_description_en, data.seo_description_de),
        ogImage: data.seo_ogImage?.trim() || undefined,
      },

      address: {
        country: data.address_country?.trim() || undefined,
        region: data.address_region?.trim() || undefined,
        city: data.address_city?.trim() || undefined,
        street: data.address_street?.trim() || undefined,
        house: data.address_house?.trim() || undefined,
        postalCode: data.address_postalCode?.trim() || undefined,
        placeId: data.address_placeId?.trim() || undefined,
        geo: {
          lat: parseNumberOrUndef(data.address_lat),
          lng: parseNumberOrUndef(data.address_lng),
        },
      },

      socialLinks: {
        instagram: data.instagram?.trim() || undefined,
        facebook: data.facebook?.trim() || undefined,
        vk: data.vk?.trim() || undefined,
      },

      contacts: {
        phones: (data.phones ?? []).map((x) => x.value?.trim()).filter(Boolean),
        emails: (data.emails ?? []).map((x) => x.value?.trim()).filter(Boolean),
        telegram: data.telegram?.trim() || undefined,
        whatsApp: data.whatsApp?.trim() || undefined,
      },

      analytics: {
        ga4Id: data.ga4Id?.trim() || undefined,
        ymId: data.ymId?.trim() || undefined,
        metaPixelId: data.metaPixelId?.trim() || undefined,
      },
    };

    setLoading(true);
    try {
      await updateProject(id, { settings: nextSettings });

      addToast({
        color: "success",
        title: "Успешно!",
        description: "Настройки сайта сохранены",
        variant: "solid",
        radius: "lg",
        timeout: 2500,
        shouldShowTimeoutProgress: true,
      });

      setItem((prev: any) => ({ ...(prev ?? {}), settings: nextSettings }));
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
  };

  const canSave = isDirty || !!logoFile || !!logoDarkFile || !!logoAltFile || !!faviconFile;

  return (
    <>
      {loading ? <LoaderModal /> : null}

      <div className="flex items-center gap-6 mb-9">
        <Button isIconOnly radius="full" onPress={() => router.back()}>
          <IoChevronBack className="text-[20px]" />
        </Button>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold leading-tight">Настройки сайта</h1>
          <p className="text-sm text-foreground-500 mt-1">
            Сохраняется в <span className="font-mono">project.settings</span>
          </p>
        </div>
      </div>

      <form
        key={formKey}
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left: logo + dark logo + alt logo + favicon */}
        <Section title="Брендинг" className="lg:col-span-1 !bg-transparent !p-0 !md:p-0">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
              <div
                className={cn("absolute inset-0", {
                  ["bg-background flex items-center justify-center"]: !logoSrc,
                })}
              >
                {logoSrc ? (
                  <Image
                    alt="Company logo"
                    src={logoSrc}
                    radius="none"
                    removeWrapper
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="flex flex-col gap-3 h-full w-full items-center justify-center text-foreground-500">
                    <MdNoPhotography className="text-[36px]" />
                    <p className="text-xs">Логотип не загружен</p>
                  </div>
                )}

                <Button
                  className="absolute bottom-3 right-3 z-10"
                  color="primary"
                  radius="full"
                  isIconOnly
                  onPress={() => logoInputRef.current?.click()}
                  type="button"
                >
                  <IoCamera className="text-[20px] min-w-[20px] mx-[2px]" />
                </Button>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setLogoFile(f);
                  }}
                />
              </div>
            </div>

            <Button
              color="primary"
              radius="full"
              type="button"
              isDisabled={!logoFile || !id}
              onPress={async () => {
                if (!id || !logoFile) return;
                try {
                  await uploadToSettings(id, "companyLogo", logoFile);
                } finally {
                  clearLogoPicked();
                }
              }}
            >
              Загрузить логотип
            </Button>

            {/* Dark Logo */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
              <div
                className={cn("absolute inset-0", {
                  ["bg-background flex items-center justify-center"]: !logoDarkSrc,
                })}
              >
                {logoDarkSrc ? (
                  <Image
                    alt="Company logo dark"
                    src={logoDarkSrc}
                    radius="none"
                    removeWrapper
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="flex flex-col gap-3 h-full w-full items-center justify-center text-foreground-500">
                    <MdNoPhotography className="text-[36px]" />
                    <p className="text-xs">Dark-логотип не загружен</p>
                  </div>
                )}

                <Button
                  className="absolute bottom-3 right-3 z-10"
                  color="primary"
                  radius="full"
                  isIconOnly
                  onPress={() => logoDarkInputRef.current?.click()}
                  type="button"
                >
                  <IoCamera className="text-[20px] min-w-[20px] mx-[2px]" />
                </Button>

                <input
                  ref={logoDarkInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setLogoDarkFile(f);
                  }}
                />
              </div>
            </div>

            <Button
              color="primary"
              radius="full"
              type="button"
              isDisabled={!logoDarkFile || !id}
              onPress={async () => {
                if (!id || !logoDarkFile) return;
                try {
                  await uploadToSettings(id, "companyLogoDark", logoDarkFile);
                } finally {
                  clearLogoDarkPicked();
                }
              }}
            >
              Загрузить dark-логотип
            </Button>

            {/* Alt Logo */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
              <div
                className={cn("absolute inset-0", {
                  ["bg-background flex items-center justify-center"]: !logoAltSrc,
                })}
              >
                {logoAltSrc ? (
                  <Image
                    alt="Company logo alt"
                    src={logoAltSrc}
                    radius="none"
                    removeWrapper
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="flex flex-col gap-3 h-full w-full items-center justify-center text-foreground-500">
                    <MdNoPhotography className="text-[36px]" />
                    <p className="text-xs">Альтернативный логотип не загружен</p>
                  </div>
                )}

                <Button
                  className="absolute bottom-3 right-3 z-10"
                  color="primary"
                  radius="full"
                  isIconOnly
                  onPress={() => logoAltInputRef.current?.click()}
                  type="button"
                >
                  <IoCamera className="text-[20px] min-w-[20px] mx-[2px]" />
                </Button>

                <input
                  ref={logoAltInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setLogoAltFile(f);
                  }}
                />
              </div>
            </div>

            <Button
              color="primary"
              radius="full"
              type="button"
              isDisabled={!logoAltFile || !id}
              onPress={async () => {
                if (!id || !logoAltFile) return;
                try {
                  await uploadToSettings(id, "companyLogoAlt", logoAltFile);
                } finally {
                  clearLogoAltPicked();
                }
              }}
            >
              Загрузить альтернативный логотип
            </Button>

            {/* Favicon */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
              <div
                className={cn("absolute inset-0", {
                  ["bg-background flex items-center justify-center"]: !faviconSrc,
                })}
              >
                {faviconSrc ? (
                  <Image
                    alt="Favicon"
                    src={faviconSrc}
                    radius="none"
                    removeWrapper
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="flex flex-col gap-3 h-full w-full items-center justify-center text-foreground-500">
                    <MdNoPhotography className="text-[36px]" />
                    <p className="text-xs">Favicon не загружен</p>
                  </div>
                )}

                <Button
                  className="absolute bottom-3 right-3 z-10"
                  color="primary"
                  radius="full"
                  isIconOnly
                  onPress={() => faviconInputRef.current?.click()}
                  type="button"
                >
                  <IoCamera className="text-[20px] min-w-[20px] mx-[2px]" />
                </Button>

                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFaviconFile(f);
                  }}
                />
              </div>
            </div>

            <Button
              color="primary"
              radius="full"
              type="button"
              isDisabled={!faviconFile || !id}
              onPress={async () => {
                if (!id || !faviconFile) return;
                try {
                  await uploadToSettings(id, "favicon", faviconFile);
                } finally {
                  clearFaviconPicked();
                }
              }}
            >
              Загрузить favicon
            </Button>
          </div>
        </Section>

        {/* Right */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Section title="Компания" description="Название компании (i18n).">
            <Grid2>
              <Input
                label="RU"
                placeholder="Название на русском"
                size="lg"
                isInvalid={Boolean(errors.companyName_ru)}
                errorMessage={errors.companyName_ru?.message}
                {...register("companyName_ru")}
              />
              <Input label="EN" placeholder="Name in English" size="lg" {...register("companyName_en")} />
              <Input label="DE" placeholder="Name auf Deutsch" size="lg" {...register("companyName_de")} />
              <div className="hidden md:block" />
            </Grid2>
          </Section>

          <Section title="SEO по умолчанию" description="Title и Description в i18n.">
            <div className="flex flex-col gap-6">
              <Grid2>
                <Input label="Title RU" size="lg" {...register("seo_title_ru")} />
                <Input label="Title EN" size="lg" {...register("seo_title_en")} />
                <Input label="Title DE" size="lg" {...register("seo_title_de")} />
                <Input
                  label="OG Image"
                  placeholder="https://..."
                  size="lg"
                  isInvalid={Boolean(errors.seo_ogImage)}
                  errorMessage={errors.seo_ogImage?.message}
                  {...register("seo_ogImage")}
                />
              </Grid2>

              <Grid2>
                <Textarea label="Description RU" minRows={4} {...register("seo_description_ru")} />
                <Textarea label="Description EN" minRows={4} {...register("seo_description_en")} />
                <Textarea label="Description DE" minRows={4} {...register("seo_description_de")} />
              </Grid2>
            </div>
          </Section>

          <Section title="Контакты" description="Телефоны, email и мессенджеры.">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="font-medium">Телефоны</p>
                <Button size="sm" variant="flat" type="button" onPress={() => phonesFA.append({ value: "+7" })}>
                  + добавить
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {phonesFA.fields.map((f, idx) => (
                  <div key={f.id} className="flex gap-3 items-start">
                    <Input
                      label={`Телефон #${idx + 1}`}
                      placeholder="+7XXXXXXXXXX"
                      size="lg"
                      className="flex-1"
                      isInvalid={Boolean((errors.phones as any)?.[idx]?.value)}
                      errorMessage={(errors.phones as any)?.[idx]?.value?.message}
                      {...register(`phones.${idx}.value` as const)}
                    />
                    <Button
                      type="button"
                      variant="flat"
                      color="danger"
                      radius="full"
                      onPress={() => phonesFA.remove(idx)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="font-medium">Emails</p>
                <Button size="sm" variant="flat" type="button" onPress={() => emailsFA.append({ value: "" })}>
                  + добавить
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {emailsFA.fields.map((f, idx) => (
                  <div key={f.id} className="flex gap-3 items-start">
                    <Input
                      label={`Email #${idx + 1}`}
                      placeholder="info@site.com"
                      size="lg"
                      className="flex-1"
                      isInvalid={Boolean((errors.emails as any)?.[idx]?.value)}
                      errorMessage={(errors.emails as any)?.[idx]?.value?.message}
                      {...register(`emails.${idx}.value` as const)}
                    />
                    <Button
                      type="button"
                      variant="flat"
                      color="danger"
                      radius="full"
                      onPress={() => emailsFA.remove(idx)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>

              <Grid2>
                <Input label="Telegram" placeholder="@username или ссылка" size="lg" {...register("telegram")} />
                <Input label="WhatsApp" placeholder="+7XXXXXXXXXX или wa.me/..." size="lg" {...register("whatsApp")} />
              </Grid2>
            </div>
          </Section>

          <Section title="Адрес и карта" description="Структура + координаты.">
            <div className="flex flex-col gap-6">
              <Grid2>
                <Input label="Страна" size="lg" {...register("address_country")} />
                <Input label="Регион" size="lg" {...register("address_region")} />
                <Input label="Город" size="lg" {...register("address_city")} />
                <Input label="Улица" size="lg" {...register("address_street")} />
                <Input label="Дом" size="lg" {...register("address_house")} />
                <Input label="Индекс" size="lg" {...register("address_postalCode")} />
              </Grid2>

              <Grid2>
                <Input label="Lat" placeholder="55.7558" size="lg" {...register("address_lat")} />
                <Input label="Lng" placeholder="37.6173" size="lg" {...register("address_lng")} />
              </Grid2>

              <Input label="Place ID (optional)" size="lg" {...register("address_placeId")} />
            </div>
          </Section>

          <Section title="Соцсети" description="Основные соцсети.">
            <Grid2>
              <Input label="Instagram" placeholder="https://instagram.com/..." size="lg" {...register("instagram")} />
              <Input label="Facebook" placeholder="https://facebook.com/..." size="lg" {...register("facebook")} />
              <Input label="VK" placeholder="https://vk.com/..." size="lg" {...register("vk")} />
              <div className="hidden md:block" />
            </Grid2>
          </Section>

          <Section title="Аналитика" description="ID трекеров (необязательно).">
            <Grid2>
              <Input label="GA4 ID" placeholder="G-XXXXXXXXXX" size="lg" {...register("ga4Id")} />
              <Input label="Yandex Metrika ID" placeholder="12345678" size="lg" {...register("ymId")} />
              <Input label="Meta Pixel ID" placeholder="123..." size="lg" {...register("metaPixelId")} />
              <div className="hidden md:block" />
            </Grid2>
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
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
