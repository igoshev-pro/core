"use client";

import { Card, CardBody } from "@heroui/react";
import { FaClock, FaDollarSign, FaUndo } from "react-icons/fa";

export default function GuaranteesSectionC({ node, ctx }: any) {
  const guarantees = [
    {
      icon: FaClock,
      title: "7 дней",
      subtitle: "Запуск за 7 рабочих дней или возврат 100% оплаты",
      description: "Если мы не уложимся в срок — вернем полную стоимость проекта.",
    },
    {
      icon: FaDollarSign,
      title: "Фикс. цена",
      subtitle: "Цена в договоре = цена в счёте",
      description: "Никаких доплат в процессе. Все включено в стоимость.",
    },
    {
      icon: FaUndo,
      title: "Возврат денег",
      subtitle: "Если за 30 дней нет заявок при трафике — возврат подписки",
      description: "Гарантируем результат или вернем деньги за подписку.",
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-foreground-50 to-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Гарантии без звёздочек
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <Card key={index} className="flex flex-col gap-3 p-3 rounded-4xl bg-background">
                <CardBody className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon className="text-3xl text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{guarantee.title}</h3>
                  <p className="text-sm font-semibold text-primary mb-3">
                    {guarantee.subtitle}
                  </p>
                  <p className="text-xs text-foreground-500">{guarantee.description}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
