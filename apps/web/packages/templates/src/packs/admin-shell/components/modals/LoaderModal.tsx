import { Modal, ModalContent } from "@heroui/react";
import { AnimatedLogo } from "../ui/AnimatedLogo";

export const LoaderModal = ({
  text = "Загрузка ...",
  blur = false,
}: {
  text?: string;
  blur?: boolean;
}) => {
  return (
    <Modal
      closeButton
      isOpen
      backdrop={blur ? "blur" : "transparent"}
      className="bg-transparent border-none"
      classNames={{
        closeButton: "hidden",
        base: "shadow-none",
      }}
      isDismissable={false}
      placement="center"
      size="xs"
    >
      <ModalContent>
        <div className="flex gap-3 items-center flex-col">
          <AnimatedLogo />
          {/* <p className="text-[18px] loading text-white">{text}</p> */}
        </div>
      </ModalContent>
    </Modal>
  );
};
