import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import { formatMoneyStr } from "@/common/helper/getFormatedMoneyStr";
import { getUserRoleString } from "@/common/helper/getUserRoleString";
import {
	Button,
	Card,
	Divider,
	Image,
	cn,
} from "@heroui/react";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdNoPhotography } from "react-icons/md";
import { RiDeleteBin5Fill, RiMoneyDollarCircleFill } from "react-icons/ri";

type Props = {
	item: Record<string, any>;
	onEdit: (item: any) => void;
	onRemove: (item: any) => void;
	onAddMoney: (item: any) => void;
};

export const UserCard = ({ item, onEdit, onRemove, onAddMoney }: Props) => {
	const onAction = (key: string) => {
		if (key === "edit") onEdit(item);
		if (key === "balance") onAddMoney(item);
		if (key === "delete") onRemove(item);
	};

	const { url } = usePresignedUrl(item.avatarPath);

	// <div
	// 							className={cn(
	// 								"relative w-full aspect-square rounded-2xl overflow-hidden",
	// 								{
	// 									["bg-foreground-100 flex items-center justify-center"]:
	// 										!previewUrl,
	// 								}
	// 							)}
	// 						>
	// 							{previewUrl ? (
	// 								<Image
	// 									src={previewUrl}
	// 									alt="Avatar preview"
	// 									fill
	// 									className="object-cover"
	// 								/>
	// 							) : (
	// 								<div className="flex flex-col gap-3 h-full w-full items-center justify-center text-foreground-500">
	// 									<MdNoPhotography className="text-[36px]" />
	// 									<p className="text-xs">Фото не загружено</p>
	// 								</div>
	// 							)}
	// 							<Button className="absolute bottom-6 right-6" color='primary' radius="full" isIconOnly onPress={pick}>
	// 								<IoCamera className="text-[20px] min-w-[20px] mx-[2px]" />
	// 							</Button>
	// 						</div>


	return (
		<>
			<Card className="flex flex-col gap-3 p-3 rounded-4xl">
				<div
					className={cn(
						"relative w-full aspect-square rounded-[21px] overflow-hidden",
						{
							["bg-foreground-100 flex items-center justify-center"]:
								!url,
						}
					)}
				>
					{url ? (
						<Image
							alt=""
							src={url}
							radius="none"
							removeWrapper
							className="absolute inset-0 w-full h-full object-cover"
						/>
					) : (
						<div className="flex flex-col items-center gap-6 text-foreground-500">
							<MdNoPhotography className="text-[36px]" />
							<p className="text-xs">Фото не загружено</p>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-3 p-4 px-4 rounded-[21px]">
					<div className="flex items-center justify-between gap-3 text-xs">
						<p>Роль</p>
						<p>{getUserRoleString(item)}</p>
					</div>
					<Divider />
					<div className="flex items-center justify-between gap-3 text-xs">
						<p>Имя</p>
						<p className="font-semibold">{item?.name}</p>
					</div>
					<Divider />
					<div className="flex items-center justify-between gap-3 text-xs">
						<p>Email</p>
						<p>{item?.email}</p>
					</div>
					<Divider />
					<div className="flex items-center justify-between gap-3 text-xs">
						<p>Баланс</p>
						<p>{formatMoneyStr([{ balance: 300000, currency: 'RUB' }], 'RUB')}</p>
					</div>
				</div>

				<div className="flex gap-2">
					<Button
						isIconOnly
						color="default"
						radius="full"
						size="md"
						variant="solid"
						onPress={() => onAction("balance")}
					>
						<RiMoneyDollarCircleFill className="text-[19px]" />
					</Button>
					<Button
						isIconOnly
						color="danger"
						radius="full"
						size="md"
						variant="flat"
						onPress={() => onAction("delete")}
					>
						<RiDeleteBin5Fill className="text-[18px]" />
					</Button>
					<Button
						className={`w-full justify-center`}
						color="default"
						radius="full"
						size="md"
						startContent={
							<BiSolidMessageSquareEdit className="text-[20px] min-w-[20px] mx-[2px]" />
						}
						variant="solid"
						onPress={() => onAction("edit")}
					>
						Редактировать
					</Button>
				</div>
			</Card>
		</>
	);
};
