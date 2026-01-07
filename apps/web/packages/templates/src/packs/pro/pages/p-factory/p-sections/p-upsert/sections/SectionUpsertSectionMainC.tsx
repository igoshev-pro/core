"use client";

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
} from "@heroui/react";
import { MdNoPhotography } from "react-icons/md";
import { IoCamera, IoChevronBack } from "react-icons/io5";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	buildUserPhotoPath,
	fileExt,
} from "@/common/helper/photo-path-generator.util";
import { LoaderModal } from "../../../../../components/modals/LoaderModal";
import { uploadFileToStorage } from "@/api/feature/storageApi";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import {
	createSection,
	getSection,
	updateSection,
} from "@/api/factory/sectionsApi";
import { SectionUpsertSectionMainProps } from "./SectionUpsertSectionMain";
import { getTemplates } from "@/api/factory/templatesApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";

const StatusEnum = ["draft", "published", "archived"] as const;

const STATUS_OPTIONS = [
	{ key: StatusEnum[0], label: "Черновик" },
	{ key: StatusEnum[1], label: "Опибликован" },
	{ key: StatusEnum[2], label: "Архив" },
] as const;

type Status = (typeof StatusEnum)[number];

type TemplateItem = {
	_id: string;
	name?: { ru?: string } | string;
};

// ✅ строгая схема для элемента props
const propItemSchema = z.object({
	key: z.string().default(""),
	value: z.string().default(""),
});

const itemSchema = z.object({
	name: z
		.string()
		.nonempty("Название обязательно")
		.min(2, "Название должно содержать минимум 2 символа"),
	key: z
		.string()
		.nonempty("Ключ обязателен")
		.min(2, "Ключ должен содержать минимум 2 символа"),
	template: z.string().min(1, "Выберите шаблон"),

	// ✅ props всегда массив, не optional
	props: z.array(propItemSchema).default([]),

	status: z
		.string()
		.min(1, "Выберите статус")
		.refine(
			(v): v is Status => (StatusEnum as readonly string[]).includes(v),
			"Выберите статус"
		),
});

type RegisterFormData = z.infer<typeof itemSchema>;

type ApiKind = "sections";
type ExtendedProps = SectionUpsertSectionMainProps & { api?: ApiKind };

function normalizePropsToArray(input: unknown): Array<{ key: string; value: string }> {
	if (!input) return [];
	if (Array.isArray(input)) {
		return input
			.map((p: any) => ({
				key: String(p?.key ?? ""),
				value: String(p?.value ?? ""),
			}))
			.filter((p) => p.key || p.value);
	}
	if (typeof input === "object") {
		return Object.entries(input as Record<string, any>)
			.map(([k, v]) => ({ key: String(k), value: String(v ?? "") }))
			.filter((p) => p.key || p.value);
	}
	return [];
}

function propsArrayToObject(arr: Array<{ key: string; value: string }>) {
	const out: Record<string, string> = {};
	arr.forEach((p) => {
		const k = p.key.trim();
		if (!k) return;
		out[k] = String(p.value ?? "");
	});
	return out;
}

export default function SectionUpsertSectionMainC({
	type,
	projectId,
	id,
	api = "sections",
}: ExtendedProps) {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [item, setItem] = useState<any>(null);

	// templates
	const [templates, setTemplates] = useState<TemplateItem[]>([]);
	const [templatesLoading, setTemplatesLoading] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		reset,
		getValues,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<RegisterFormData>({
        // @ts-ignore
		resolver: zodResolver(itemSchema),
		defaultValues: { status: "draft", template: "", props: [] },
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "props",
	});

	const ops = useMemo(() => {
		switch (api) {
			case "sections":
				return { get: getSection, create: createSection, update: updateSection };
			default:
				return { get: getSection, create: createSection, update: updateSection };
		}
	}, [api]);

	// ===== load templates =====
	useEffect(() => {
		let cancelled = false;

		(async () => {
			setTemplatesLoading(true);
			try {
				const data = await getTemplates();
				if (!cancelled) setTemplates(Array.isArray(data) ? data : []);
			} catch {
				// noop
			} finally {
				if (!cancelled) setTemplatesLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const TEMPLATE_OPTIONS = useMemo(() => {
		return templates.map((t) => ({
			key: t._id,
			label: (t as any)?.name?.ru ?? (t as any)?.name ?? t._id,
		}));
	}, [templates]);

	// ===== avatar state =====
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

	const upload = async (userId: string) => {
		if (!file) return;

		try {
			const ext = fileExt(file);
			const path = buildUserPhotoPath({ projectId, userId, kind: "preview", ext });

			const uploaded = await uploadFileToStorage({
				projectId,
				file,
				path,
				expiresInSec: 60,
				apiBaseUrl: process.env.CORE_API_URL! || "https://api.igoshev.pro/core",
			});

			if (!uploaded) {
				addToast({
					color: "danger",
					title: "Ошибка!",
					description: `Произошла ошибка при загрузке файла`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
				return;
			}

			await ops.update(userId, { previewPath: uploaded.path, gallery: [uploaded] });

			setItem((prev: any) => ({
				...(prev ?? {}),
				_id: userId,
				previewPath: uploaded.path,
				photos: [uploaded],
			}));

			addToast({
				color: "success",
				title: "Успешно!",
				description: `Фото обновлено`,
				variant: "solid",
				radius: "lg",
				timeout: 2500,
				shouldShowTimeoutProgress: true,
			});
		} catch {
			addToast({
				color: "danger",
				title: "Ошибка!",
				description: `Произошла ошибка при загрузке файла`,
				variant: "solid",
				radius: "lg",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});
		} finally {
			clearPickedFile();
		}
	};

	// ===== load on edit =====
	useEffect(() => {
		if (type !== UpsertType.Update || !id) return;

		setLoading(true);
		ops
			.get(id)
			.then((res: any) => {
				setItem(res);

				reset({
					name: res?.name?.ru ?? "",
					key: res?.key ?? "",
					template: res?.template?._id ?? res?.template ?? "",
					props: normalizePropsToArray(res?.props),
					status: res?.status ?? "draft",
				});
			})
			.catch(() => {
				addToast({
					color: "danger",
					title: "Ошибка!",
					description: `Не удалось загрузить секцию`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			})
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type, id, ops]);

	const avatarSrc = previewUrl ?? remoteUrl ?? null;

	// ✅ добавить строку props только если последняя полностью заполнена
	const addPropRow = () => {
		const current = getValues("props");
		const last = current[current.length - 1];
		if (last && (!last.key.trim() || !last.value.trim())) return;
		append({ key: "", value: "" });
	};

	const onSubmit = async (data: RegisterFormData) => {
		const payload = {
			...data,
			template: data.template,
			name: { ru: data.name },
			props: propsArrayToObject(data.props), // отправляем объект key->value
		};

		if (type === UpsertType.Create) {
			setLoading(true);
			try {
				const created = await ops.create(payload);

				if (file && created?._id) await upload(created._id);

				addToast({
					color: "success",
					title: "Успешно!",
					description: `Секция создана успешно`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
				router.push(`/admin/factory/sections`);
			} catch {
				addToast({
					color: "danger",
					title: "Ошибка!",
					description: `Произошла ошибка при создании секции`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			} finally {
				reset({ status: "draft", template: "", props: [], name: "", key: "" });
				clearPickedFile();
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
					description: `Данные сохранены`,
					variant: "solid",
					radius: "lg",
					timeout: 2500,
					shouldShowTimeoutProgress: true,
				});

				setItem((prev: any) => ({ ...(prev ?? {}), ...payload }));
				reset(data); // ✅ reset именно формы (props остаются массивом)
			} catch {
				addToast({
					color: "danger",
					title: "Ошибка!",
					description: `Произошла ошибка при сохранении`,
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

	return (
		<>
			{loading ? (
				<LoaderModal />
			) : (
				<>
					<div className="flex items-center gap-6 mb-9">
						<Button isIconOnly radius="full" onPress={() => router.back()}>
							<IoChevronBack className="text-[20px]" />
						</Button>
						<h1 className="text-3xl font-bold">
							{type === UpsertType.Create ? "Создание секции" : "Редактирование секции"}{" "}
							{type === UpsertType.Update ? (
								<span className="text-primary">{item?.name?.ru ?? ""}</span>
							) : null}
						</h1>
					</div>

					<div className="grid grid-cols-3 gap-6">
						<div className="rounded-3xl">
							<div
								className={cn("relative w-full h-full rounded-3xl overflow-hidden", {
									["bg-background flex items-center justify-center"]: !avatarSrc,
								})}
							>
								{avatarSrc ? (
									<Image
										alt="Avatar"
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
									onPress={pick}
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

						<div className="col-span-2 bg-background p-9 rounded-3xl flex flex-col gap-6">
							<h2 className="font-semibold text-xl">Данные</h2>

							<form className="flex flex-col gap-6 w-full">
								<Input
									errorMessage={errors?.name?.message}
									isInvalid={Boolean(errors.name)}
									placeholder="Имя"
									size="lg"
									type="text"
									{...register("name")}
								/>

								<Input
									errorMessage={errors?.key?.message}
									isInvalid={Boolean(errors.key)}
									placeholder="Ключ"
									size="lg"
									type="text"
									{...register("key")}
								/>

								<Controller
									name="template"
									control={control}
									render={({ field, fieldState }) => (
										<Select
											label="Шаблон"
											selectedKeys={field.value ? new Set([field.value]) : new Set()}
											isInvalid={!!fieldState.error}
											errorMessage={fieldState.error?.message}
											isDisabled={templatesLoading || TEMPLATE_OPTIONS.length === 0}
											onSelectionChange={(keys) => {
												const value = Array.from(keys)[0] as RegisterFormData["template"];
												field.onChange(value);
											}}
											onBlur={field.onBlur}
										>
											{TEMPLATE_OPTIONS.map((opt) => (
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
											onSelectionChange={(keys) => {
												const value = Array.from(keys)[0] as RegisterFormData["status"];
												field.onChange(value);
											}}
											onBlur={field.onBlur}
										>
											{STATUS_OPTIONS.map((item) => (
												<SelectItem key={item.key}>{item.label}</SelectItem>
											))}
										</Select>
									)}
								/>

								{/* ===== Props (key/value) ===== */}
								<div className="mt-2 flex flex-col gap-3">
									<div className="flex items-center justify-between">
										<div className="text-sm font-semibold">Props</div>
										<Button
											radius="full"
											variant="light"
											startContent={<FiPlus />}
											onPress={addPropRow}
										>
											Добавить
										</Button>
									</div>

									{fields.length === 0 ? (
										<div className="text-xs opacity-60">Нет props — добавь при необходимости.</div>
									) : null}

									{fields.map((f, idx) => (
										<div key={f.id} className="flex gap-3 items-start">
											<Input placeholder="key" size="lg" {...register(`props.${idx}.key`)} />
											<Input placeholder="value" size="lg" {...register(`props.${idx}.value`)} />
											<Button
												isIconOnly
												radius="full"
												variant="light"
												color="danger"
												onPress={() => remove(idx)}
											>
												<RiDeleteBin5Fill className="text-[18px]" />
											</Button>
										</div>
									))}
								</div>
							</form>
						</div>

						<div className="col-span-3 flex justify-end">
							<Button
								color="primary"
								size="lg"
								radius="full"
								isLoading={isSubmitting}
								isDisabled={type === UpsertType.Update ? (!isDirty && !file) : false}
                                // @ts-ignore
								onPress={() => handleSubmit(onSubmit)()}
							>
								{type === UpsertType.Create ? "Создать" : "Сохранить"}
							</Button>
						</div>
					</div>
				</>
			)}
		</>
	);
}
