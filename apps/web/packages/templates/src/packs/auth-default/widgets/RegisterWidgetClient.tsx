"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OtpModal } from "../modals/OtpModal";

// import { OtpModal } from "../modals/OtpModal";

// import { ROUTES } from "@/app/routes";
// import { useOtpMutation, useRegisterMutation } from "@/api/services/authApi";

const registerSchema = z.object({
  name: z
    .string()
    .nonempty("Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа"),
  email: z
    .email({ message: "Введите корректный email" })
    .min(1, "Email обязателен"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterWidgetClient = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // const [registration] = useRegisterMutation();
  // const [otp] = useOtpMutation();

  const onSubmit = async (data: RegisterFormData) => {
    onOpen()
    // registration(data)
    //   .unwrap()
    //   .then((res: any) => {
    //     // ✅ Выполняем otp только если регистрация успешна
    //     otp({ email: data.email })
    //       .unwrap()
    //       .then(() => onOpen())
    //       .catch((err) => {
    //         switch (err.status) {
    //           case 404:
    //             addToast({
    //               color: "danger",
    //               title: "Ошибка!",
    //               description: "Пользователь с таким email не найден",
    //               variant: "solid",
    //               radius: "lg",
    //               timeout: 3000,
    //               shouldShowTimeoutProgress: true,
    //             });
    //             break;
    //           default:
    //             addToast({
    //               color: "danger",
    //               title: "Ошибка!",
    //               description: "Что-то пошло не так :(",
    //               timeout: 3000,
    //               shouldShowTimeoutProgress: true,
    //             });
    //         }
    //       });
    //   })
    //   .catch((err) => {
    //     // Ошибка регистрации
    //     addToast({
    //       color: "danger",
    //       title: "Ошибка!",
    //       description: "Не удалось зарегистрироваться",
    //       timeout: 3000,
    //       shouldShowTimeoutProgress: true,
    //     });
    //   });
  };

  return (
    <div className="w-[500px] flex flex-col gap-9">
      <form
        className="w-[500px] flex flex-col gap-9"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-5xl font-bold">Регистрация</h1>
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
        <Button
          className="font-bold shadow-custom"
          color="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          radius="full"
          size="lg"
          type="submit"
        >
          {isSubmitting ? "Отправка..." : "Зарегистрироваться"}
        </Button>
        <div className="flex justify-center">
          <div className="text-xs">
            Есть аккаунт?{" "}
            <button
              className="text-primary cursor-pointer"
              onClick={() => router.push(`/login`)}
            >
              Вход
            </button>
          </div>
        </div>
      </form>

      <OtpModal
        email={getValues("email")}
        isOpen={isOpen}
        resend={() => onSubmit(getValues())}
        onClose={onClose}
      />
    </div>
  );
};
