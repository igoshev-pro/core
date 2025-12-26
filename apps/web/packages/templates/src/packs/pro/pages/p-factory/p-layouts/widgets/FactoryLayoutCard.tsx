"use client";

import React from "react";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import { getUserRoleString } from "@/common/helper/getUserRoleString";
import { MdNoPhotography } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { EntityCard } from "../../../widgets/EntityCard";

type Props = {
  item: Record<string, any>;
  onEdit: (item: any) => void;
  onRemove: (item: any) => void;
  onAddMoney?: (item: any) => void;
};

export const FactoryLayoutCard = ({ item, onEdit, onRemove }: Props) => {
  const { url } = usePresignedUrl(item.previewPath);

  return (
    <EntityCard
      imageUrl={url}
      placeholder={
        <div className="flex flex-col items-center gap-6 text-foreground-500">
          <MdNoPhotography className="text-[36px]" />
          <p className="text-xs">Фото не загружено</p>
        </div>
      }
      rows={[
        { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
        { label: "Mode", value: item?.email ?? "—" },
      ]}
      actions={[
        {
          key: "delete",
          icon: <RiDeleteBin5Fill className="text-[18px]" />,
          color: "danger",
          variant: "flat",
          onPress: () => onRemove(item),
        },
        {
          key: "edit",
          icon: (
            <BiSolidMessageSquareEdit className="text-[20px] min-w-[20px] mx-[2px]" />
          ),
          color: "default",
          variant: "solid",
          onPress: () => onEdit(item),
        },
      ]}
    />
  );
};
