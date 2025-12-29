"use client";

import { addToast, Input, Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { withProjectId } from "@/api/utils/withProjectId";
import { OtpModal } from "../modals/OtpModal";
import { useState } from "react";
import { getOtp } from "@/api/core/authApi";

const loginSchema = z.object({
  email: z
    .email({ message: "Введите корректный email" })
    .min(1, "Email обязателен"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginWidgetClient = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await getOtp(data);
      onOpen()
    } catch (err: any) {
      switch (err.status) {
        case 404:
          addToast({
            color: "danger",
            title: "Ошибка!",
            description: "Пользователь с таким email не найден",
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
    <div>
      <form
        className="flex flex-col gap-9 z-50"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-5xl font-semibold text-white">Вход</h1>
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
          {isSubmitting ? "Отправка..." : "Войти"}
        </Button>
        {/* <div className="flex justify-center">
          <div className="text-xs">
            Еще нет аккаунта?{" "}
            <button
              className="text-primary cursor-pointer"
              onClick={() => router.push(`/login/new${withProjectId()}`)}
            >
              Регистрация
            </button>
          </div>
        </div> */}
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
