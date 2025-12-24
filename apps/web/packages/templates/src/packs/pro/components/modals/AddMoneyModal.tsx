"use client";

import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";

import { LoaderModal } from "./LoaderModal";
import { formatMoneyStr } from "@/common/helper/getFormatedMoneyStr";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
};

export const AddMoneyModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const addBalance = async () => {
    // setLoading(true);

    // addMoney({
    //   id: user?._id,
    //   body: {
    //     amount: parseInt(amount),
    //     currency: user?.currentCurrency || "RUB",
    //   },
    // })
    //   .unwrap()
    //   .then(() => {
    //     addToast({
    //       color: "success",
    //       title: "Успешно!",
    //       description: `Баланс успешно пополнен на  ${formatRubleWithThousands(amount)}`,
    //       variant: "solid",
    //       radius: "lg",
    //       timeout: 3000,
    //       shouldShowTimeoutProgress: true,
    //     });
    //     setAmount("");
    //     setLoading(false);
    //     onClose();
    //   })
    //   .catch((arr) => {
    //     addToast({
    //       color: "danger",
    //       title: "Ошибка!",
    //       description: "Ошибка при пополнении баланса",
    //       variant: "solid",
    //       radius: "lg",
    //       timeout: 3000,
    //       shouldShowTimeoutProgress: true,
    //     });
    //     setAmount("");
    //     setLoading(false);
    //     onClose();
    //   });
  };

  return (
    <>
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
                <p className="text-2xl font-bold">Добавить баланс</p>
              </ModalHeader>
              <ModalBody className="items-center">
                <p className="text-sm mb-2">
                  Текущий баланс пользователя{" "}
                  {formatMoneyStr([{ balance: 300000, currency: 'RUB' }], 'RUB')}
                </p>

                <Input
                  placeholder="Сумма пополнения"
                  size="lg"
                  type="text"
                  value={amount}
                  onValueChange={(value: string) =>
                    setAmount(value.replace(/\D/g, ""))
                  }
                />
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
                    color="primary"
                    radius="full"
                    size="md"
                    onPress={addBalance}
                  >
                    Зачислить
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {loading ? <LoaderModal blur /> : null}
    </>
  );
};
