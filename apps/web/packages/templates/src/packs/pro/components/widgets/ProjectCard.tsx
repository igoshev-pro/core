import { Button, Card, Image, Divider, cn } from "@heroui/react";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdNoPhotography } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FC } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

import { ProjectType, projectTypeOptions } from "../../../../../../../types/project";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";

type Props = {
  project: any;
  onEdit: (project: any) => void;
  onRemove: (project: any) => void;
};

export const ProjectCard: FC<Props> = ({ project, onEdit, onRemove }) => {
  function getProjectType(type: ProjectType): string {
    const found = projectTypeOptions.find((t) => t.key === type);
    return found ? found.label : "Неизвестный тип";
  }

  const onAction = (key: string) => {
    if (key === "link") {
      window?.open(`https://${project?.domainCustom ?? project?.domainTech}`, "_blank");
    }
    if (key === "edit") onEdit(project);
    if (key === "remove") onRemove(project);
  };

  const { url } = usePresignedUrl(project?.preview);

  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-3 rounded-4xl",
        // ✅ курсор как у dnd карточек
        "cursor-grab active:cursor-grabbing",
        // ✅ чтобы drag не выделял текст/картинки и курсор ощущался корректно
        "select-none"
      )}
    >
      <div
        className={cn(
          "relative w-full aspect-square rounded-[21px] overflow-hidden",
          {
            ["bg-foreground-100 flex items-center justify-center"]: !url,
          }
        )}
      >
        {url ? (
          <Image
            alt=""
            src={url}
            radius="none"
            removeWrapper
            // ✅ важно: картинка не должна перехватывать pointer-события для dnd ощущения
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center gap-6 text-foreground-500">
            <MdNoPhotography className="text-[36px]" />
            <p className="text-xs">Превью не загружено</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4 px-4 rounded-[21px]">
        <div className="flex items-center justify-between gap-3 text-xs">
          <p>Тип</p>
          <p>{getProjectType(project?.type)}</p>
        </div>
        <Divider />
        <div className="flex items-center justify-between gap-3 text-xs">
          <p>Название</p>
          {/* ✅ 1 строка + троеточие */}
          <p className="font-semibold truncate min-w-0">{project?.name}</p>
        </div>
        <Divider />
        <div className="flex items-center justify-between gap-3 text-xs">
          <p>Ссылка</p>
          <p className="truncate min-w-0">{project?.domainCustom ?? project?.domainTech}</p>
        </div>
        <Divider />
      </div>

      {/* ✅ кнопки должны оставаться кликабельными и с обычным курсором */}
      <div className="flex gap-2 justify-between cursor-default">
        <Button
          isIconOnly
          color="default"
          radius="full"
          size="md"
          variant="solid"
          onPress={() => onAction("link")}
          className="cursor-pointer"
        >
          <FaExternalLinkAlt className="text-[14px]" />
        </Button>

        <div className="flex gap-2">
          <Button
            isIconOnly
            color="danger"
            radius="full"
            size="md"
            variant="flat"
            onPress={() => onAction("remove")}
            className="cursor-pointer"
          >
            <RiDeleteBin5Fill className="text-[18px]" />
          </Button>

          <Button
            isIconOnly
            color="default"
            radius="full"
            size="md"
            variant="solid"
            onPress={() => onAction("edit")}
            className="cursor-pointer"
          >
            <BiSolidMessageSquareEdit className="text-[20px] min-w-[20px] mx-[2px]" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
