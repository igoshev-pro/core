"use client";

import { useRouter } from "next/navigation";
import { TemplateUpsertSectionMainProps } from "./TemplateUpsertSectionMain";
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
import { Controller, useForm } from "react-hook-form";
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
import { createTemplate, getTemplate, updateTemplate } from "@/api/factory/templatesApi";

const StatusEnum = ["draft", "published", "archived"] as const;
const ModeEnum = ["public", "admin", "login"] as const;

const STATUS_OPTIONS = [
	{ key: StatusEnum[0], label: "Черновик" },
	{ key: StatusEnum[1], label: "Опибликован" },
	{ key: StatusEnum[2], label: "Архив" },
] as const;

const MODE_OPTIONS = [
	{ key: ModeEnum[0], label: "Публичный" },
	{ key: ModeEnum[1], label: "Закрытый" },
	{ key: ModeEnum[2], label: "Авторизация" },
] as const;

type Status = (typeof StatusEnum)[number];
type Mode = (typeof ModeEnum)[number];

const itemSchema = z.object({
	name: z
		.string()
		.nonempty("Название обязательно")
		.min(2, "Название должно содержать минимум 2 символа"),
	slug: z
		.string()
		.nonempty("Slug обязателен")
		.min(2, "Slug должен содержать минимум 2 символа"),
	mode: z
		.string()
		.min(1, "Выберите режим")
		.refine(
			(v): v is Mode => (ModeEnum as readonly string[]).includes(v),
			"Выберите режим"
		),
	status: z
		.string()
		.min(1, "Выберите статус")
		.refine(
			(v): v is Status => (StatusEnum as readonly string[]).includes(v),
			"Выберите статус"
		),
});

type RegisterFormData = z.infer<typeof itemSchema>;

type ApiKind = "templates";
type ExtendedProps = TemplateUpsertSectionMainProps & { api?: ApiKind };

export default function TemplateUpsertSectionMainC({
	type,
	projectId,
	id,
	api = "templates",
}: ExtendedProps) {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [item, setItem] = useState<any>(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(itemSchema),
		defaultValues: { status: "draft", mode: "public" },
	});

	const ops = useMemo(() => {
		switch (api) {
			case "templates":
				return { get: getTemplate, create: createTemplate, update: updateTemplate };
			// case "superAdmin":
			// case "user":
			default:
				return { get: getTemplate, create: createTemplate, update: updateTemplate };
		}
	}, [api]);

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

			// ✅ чтобы сразу обновилось изображение в UI (remoteUrl подтянется по avatarPath)
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
			// ✅ после аплоада возвращаемся к remoteUrl (и не держим выбранный файл)
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
					mode: res?.mode ?? "public",
					status: res?.status ?? "draft",
				});
			})
			.catch(() => {
				addToast({
					color: "danger",
					title: "Ошибка!",
					description: `Не удалось загрузить шаблон`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			})
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type, id, ops]);

	// ✅ источник картинки: если выбран новый файл — preview, иначе remote
	const avatarSrc = previewUrl ?? remoteUrl ?? null;

	const onSubmit = async (data: RegisterFormData) => {
		if (type === UpsertType.Create) {
			setLoading(true);
			try {
				const user = await ops.create({ ...data, name: { ru: data.name } });

				if (file && user?._id) {
					await upload(user._id);
				}

				addToast({
					color: "success",
					title: "Успешно!",
					description: `Шаблон создан успешно`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
				router.push(`/admin/factory/templates`);
			} catch {
				addToast({
					color: "danger",
					title: "Ошибка!",
					description: `Произошла ошибка при создании шаблона`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			} finally {
				reset();
				clearPickedFile();
				setLoading(false);
			}
			return;
		}

		if (type === UpsertType.Update && id) {
			setLoading(true);
			try {
				await ops.update(id, { ...data, name: { ru: data.name } });

				if (file) {
					await upload(id);
				}

				addToast({
					color: "success",
					title: "Успешно!",
					description: `Данные сохранены`,
					variant: "solid",
					radius: "lg",
					timeout: 2500,
					shouldShowTimeoutProgress: true,
				});

				// остаёмся на странице, просто обновим item + сбросим dirty
				setItem((prev: any) => ({ ...(prev ?? {}), ...data }));
				reset(data);
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
						<Button isIconOnly radius="full" onPress={() => router.back()}><IoChevronBack className="text-[20px]" /></Button>
						<h1 className="text-3xl font-bold">
							{type === UpsertType.Create ? "Создание шаблона" : "Редактирование шаблона"}{" "}
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
									errorMessage={errors?.slug?.message}
									isInvalid={Boolean(errors.slug)}
									placeholder="Slug"
									size="lg"
									type="text"
									{...register("slug")}
								/>

								<Controller
									name="mode"
									control={control}
									render={({ field, fieldState }) => (
										<Select
											label="Режим"
											selectedKeys={field.value ? new Set([field.value]) : new Set()}
											isInvalid={!!fieldState.error}
											errorMessage={fieldState.error?.message}
											onSelectionChange={(keys) => {
												const value = Array.from(keys)[0] as RegisterFormData["mode"];
												field.onChange(value);
											}}
											onBlur={field.onBlur}
										>
											{MODE_OPTIONS.map((item) => (
												<SelectItem key={item.key}>{item.label}</SelectItem>
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
							</form>
						</div>

						<div className="col-span-3 flex justify-end">
							<Button
								color="primary"
								size="lg"
								radius="full"
								isLoading={isSubmitting}
								isDisabled={type === UpsertType.Update ? (!isDirty && !file) : false}
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
