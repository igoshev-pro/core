"use client";

import { useRouter } from "next/navigation";
import { ClientUpsertSectionMainProps } from "./ClientUpsertSectionMainS";
import { UpsertType } from "@/packages/templates/common/enum/main";
import { Button } from "@heroui/react";

export default function ClientUpsertSectionMainC({ type }: ClientUpsertSectionMainProps) {
	const router = useRouter();

	console.log(type)

	const handleSubmit = () => {

	}

	return (
		<div className="flex justify-between items-center mb-9">
			<h1 className="text-3xl font-bold">
				{type === UpsertType.Create ? "Создание клиента" : "Редактирование клиента"}{" "}
				{type === UpsertType.Update ? (
					<span className="text-primary">Имя клиента</span>
				) : null}
			</h1>
			<Button color="primary" radius="full" onPress={handleSubmit}>
				{type === UpsertType.Create ? "Создать" : "Сохранить"}
			</Button>
		</div>
	);
}
