"use client";

import { useRouter } from "next/navigation";
import { ClientUpsertSectionMainProps } from "./ClientUpsertSectionMainS";
import { UpsertType } from "@/packages/templates/common/enum/main";
import { addToast, Button, cn, Input, Select, SelectItem } from "@heroui/react";
import { MdNoPhotography } from "react-icons/md";
import { IoCamera } from "react-icons/io5";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { buildUserPhotoPath, fileExt } from "@/common/helper/photo-path-generator.util";
import { uploadFileToStorage } from "@/common/helper/storage.client";
import Image from "next/image"
import { LoaderModal } from "../../../../components/modals/LoaderModal";
import { createClient, updateClient } from "@/api/core/clientsApi";

// const RoleEnum = ["client", "user"] as const;
const StatusEnum = ["active", "blocked", "archived"] as const;

// const ROLE_OPTIONS = [
// 	{ key: RoleEnum[0], label: "Клиент" },
// 	{ key: RoleEnum[1], label: "Пользователь" },
// ] as const;

const STATUS_OPTIONS = [
	{ key: StatusEnum[0], label: "Активен" },
	{ key: StatusEnum[1], label: "Заблокирован" },
	{ key: StatusEnum[2], label: "Архив" }
] as const;

// type Role = (typeof RoleEnum)[number];
type Status = (typeof StatusEnum)[number];

const clientSchema = z.object({
	name: z
		.string()
		.nonempty("Имя обязательно")
		.min(2, "Имя должно содержать минимум 2 символа"),
	email: z
		.email({ message: "Введите корректный email" })
		.min(1, "Email обязателен"),
	// role: z
	// 	.string()
	// 	.min(1, "Выберите роль")
	// 	.refine((v): v is Role => (RoleEnum as readonly string[]).includes(v), "Выберите роль"),
	status: z
		.string()
		.min(1, "Выберите статус")
		.refine((v): v is Status => (StatusEnum as readonly string[]).includes(v), "Выберите статус"),
});

type RegisterFormData = z.infer<typeof clientSchema>;

export default function ClientUpsertSectionMainC({ type, projectId }: ClientUpsertSectionMainProps) {
	const router = useRouter();

	const [loading, setLoading] = useState(false)

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			// role: "client",
			status: "active",
		},
	});

	const onSubmit = async (data: RegisterFormData) => {
		console.log(data)
		if (type === UpsertType.Create) {
			setLoading(true)

			try {
				const user = await createClient(data)

				if (!user?._id) {
					addToast({
						color: "danger",
						title: "Ошибка!",
						description: `Произошла ошибка при создании клиента`,
						variant: "solid",
						radius: "lg",
						timeout: 3000,
						shouldShowTimeoutProgress: true,
					});
				}

				await upload(user._id)

				addToast({
                color: "success",
                title: "Успешно!",
                description: `Пользователь создан успешно`,
                variant: "solid",
                radius: "lg",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
			} catch (err) {
				addToast({
					color: "danger",
					title: "Ошибка!",
					description: `Произошла ошибка при создании клиента`,
					variant: "solid",
					radius: "lg",
					timeout: 3000,
					shouldShowTimeoutProgress: true,
				});
			} finally {
				setLoading(false)
			}
		}
	}

	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const pick = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = () => {
			const f = input.files?.[0];
			if (f) setFile(f);
		};
		input.click();
	};

	const upload = async (userId: string) => {
		if (!file) return;
		setIsUploading(true);
		try {
			const ext = fileExt(file);
			const path = buildUserPhotoPath({ projectId, userId, kind: "avatar", ext });

			const uploaded = await uploadFileToStorage({
				projectId,
				file,
				path,
				expiresInSec: 60,
				apiBaseUrl: process.env.CORE_API_URL! || 'https://api.igoshev.pro',
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
			}

			await updateClient( userId, { avatarPath: uploaded.path, photos: [uploaded] })
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<>
			{loading ? (
				<LoaderModal />
			) : (<>
				<div className="flex justify-between items-center mb-9">
					<h1 className="text-3xl font-bold">
						{type === UpsertType.Create ? "Создание клиента" : "Редактирование клиента"}{" "}
						{type === UpsertType.Update ? (
							<span className="text-primary">Имя клиента</span>
						) : null}
					</h1>
				</div>

				<div className="grid grid-cols-3 gap-6">
					<div className="bg-background p-6 rounded-3xl">
						<div
							className={cn(
								"relative w-full aspect-square rounded-2xl overflow-hidden",
								{
									["bg-foreground-100 flex items-center justify-center"]:
										!previewUrl,
								}
							)}
						>
							{previewUrl ? (
								<Image
									src={previewUrl}
									alt="Avatar preview"
									fill
									className="object-cover"
								/>
							) : (
								<div className="flex flex-col gap-3 h-full w-full items-center justify-center text-foreground-500">
									<MdNoPhotography className="text-[36px]" />
									<p className="text-xs">Фото не загружено</p>
								</div>
							)}
							<Button className="absolute bottom-6 right-6" color='primary' radius="full" isIconOnly onPress={pick}>
								<IoCamera className="text-[20px] min-w-[20px] mx-[2px]" />
							</Button>
						</div>

					</div>
					<div className="col-span-2 bg-background p-9 rounded-3xl flex flex-col gap-6">
						<h2 className="font-semibold text-xl">Данные</h2>

						<form
							className="flex flex-col gap-6 w-full"
						>
							<Input
								errorMessage={errors?.name?.message}
								isInvalid={Boolean(errors.name)}
								placeholder="Имя"
								size="lg"
								type="text"
								{...register("name")}
							/>
							<Input
								errorMessage={errors?.email?.message}
								isInvalid={Boolean(errors.email)}
								placeholder="Email"
								size="lg"
								type="email"
								{...register("email")}
							/>
							{/* <Controller
								name="role"
								control={control}
								render={({ field, fieldState }) => (
									<Select
										label="Роль"
										selectedKeys={field.value ? new Set([field.value]) : new Set()}
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
										onSelectionChange={(keys) => {
											const value = Array.from(keys)[0] as RegisterFormData["role"];
											field.onChange(value);
										}}
										onBlur={field.onBlur}
									>
										{ROLE_OPTIONS.map((item) => (
											<SelectItem key={item.key}>{item.label}</SelectItem>
										))}
									</Select>
								)}
							/> */}
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
					{/* <div className="col-span-3 bg-background p-6 rounded-3xl hover:shadow-2xl">Проекты</div> */}
					<div className="col-span-3 flex justify-end">
						<Button
							color="primary"
							size="lg"
							radius="full"
							isLoading={isSubmitting}
							onPress={() => handleSubmit(onSubmit)()}
						>
							{type === UpsertType.Create ? "Создать" : "Сохранить"}
						</Button>
					</div>
				</div>
			</>)}
		</>
	);
}