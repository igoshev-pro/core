"use client";

import { login } from "@/api/core/authApi";
import { withProjectId } from "@/api/utils/withProjectId";
import {
  addToast,
  Button,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  resend: () => void;
};

export const OtpModal: React.FC<Props> = ({
  isOpen,
  onClose,
  email,
  resend,
}) => {
  const [timer, setTimer] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(interval);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const [otp, setOtp] = useState<string>("");

  const onLogin = async (email: string, otp: string) => {
    try {
      const res = await login({ email, otp });
      if (res) {
        router.push(`/admin${withProjectId()}`)
      }
    } catch (err: any) {
      switch (err.status) {
        case 401:
          addToast({
            color: "danger",
            title: "Ошибка!",
            description: "Код неверный или срок его действия истёк",
            variant: "solid",
            radius: "lg",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
          });
          break;
        default:
          addToast({
            color: "danger",
            title: "Ошибка!",
            description: "Что-то пошло не так :(",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
          });
      }
    }
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        closeButton: "hidden",
        base: "rounded-4xl",
      }}
      isDismissable={false}
      isOpen={isOpen}
      radius="lg"
      size="sm"
      placement="center"
      onClose={onClose}
    >
      <ModalContent className="py-3 pt-5">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-1">
              <p className="text-2xl font-bold">Введите код</p>
            </ModalHeader>
            <ModalBody className="items-center">
              <p className="text-xs">Мы отправили код на {email}</p>

              <InputOtp
                className="mt-2"
                classNames={{
                  segment: "text-3xl h-[60px] mx-[2px] rounded-2xl",
                }}
                color="success"
                length={6}
                radius="lg"
                size="lg"
                variant="bordered"
                onComplete={(value: any) => {
                  setOtp(value);
                  onLogin(email, value);
                }}
              />
            </ModalBody>
            <ModalFooter className="flex flex-col items-center">
              <Button
                className="w-full shadow-custom"
                color="primary"
                radius="full"
                size="lg"
                onPress={() => onLogin(email, otp)}
              >
                Отправить
              </Button>

              <div className="text-xs mt-4">
                Не получили код?{" "}
                {timer === 0 ? (
                  <button
                    className="text-primary cursor-pointer"
                    onClick={() => {
                      resend();
                      setTimer(60);
                    }}
                  >
                    Отправить код повторно
                  </button>
                ) : (
                  <span className="text-primary cursor-pointer">
                    Запросить повторно через {timer} сек
                  </span>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
