"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  title: string;
  text: string;
  actionBtnText: string;
};

export const ConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAction,
  title,
  text,
  actionBtnText,
}) => {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "rounded-4xl",
        closeButton: "m-3.5",
      }}
      isDismissable={false}
      isOpen={isOpen}
      radius="lg"
      size="sm"
      onClose={onClose}
    >
      <ModalContent className="py-3 pt-5">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-1">
              <p className="text-2xl font-bold">{title}</p>
            </ModalHeader>
            <ModalBody className="items-center">
              <p className="">{text}</p>
            </ModalBody>
            <ModalFooter className="flex flex-col items-center">
              <div className="w-full flex flex-row gap-3">
                <Button
                  className="w-full"
                  color="default"
                  radius="full"
                  size="md"
                  onPress={onClose}
                >
                  Отмена
                </Button>

                <Button
                  className="w-full shadow-custom"
                  color="danger"
                  radius="full"
                  size="md"
                  onPress={onAction}
                >
                  {actionBtnText}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
