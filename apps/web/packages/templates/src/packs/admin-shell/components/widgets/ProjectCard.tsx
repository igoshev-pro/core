import { Button, Card, Image, Divider, cn } from "@heroui/react";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdNoPhotography } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FC } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

// import { getMedia } from "@/helper/getMedia";
import { ProjectType, projectTypeOptions } from "../../types/project";

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
      window?.open(`https://${project?.url}`, "_blank");
    }
    if (key === "edit") onEdit(project);
    if (key === "remove") {
      onRemove(project);
    }
  };

  return (
    <>
      <Card className="flex flex-col gap-3 p-3 rounded-4xl">
        <div
          className={cn(
            "relative w-full aspect-[100/70] rounded-[21px] overflow-hidden",
            {
              ["bg-foreground-100 flex items-center justify-center"]:
                !project?.preview,
            },
          )}
        >
          {project?.preview ? (
            <Image
              alt=""
              className="object-cover w-full h-full"
              radius="none"
            //   src={getMedia(project?.preview)}
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
            <p className="font-semibold">{project?.name}</p>
          </div>
          <Divider />
          <div className="flex items-center justify-between gap-3 text-xs">
            <p>Ссылка</p>
            <p>{project?.url}</p>
          </div>
          <Divider />
        </div>

        <div className="flex gap-2">
          <Button
            isIconOnly
            color="default"
            radius="full"
            size="md"
            variant="solid"
            onPress={() => onAction("link")}
          >
            <FaExternalLinkAlt className="text-[14px]" />
          </Button>
          <Button
            isIconOnly
            color="danger"
            radius="full"
            size="md"
            variant="flat"
            onPress={() => onAction("remove")}
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
