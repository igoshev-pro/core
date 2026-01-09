"use client";

import { Card, CardBody } from "@heroui/react";
import { FaBolt, FaShieldAlt, FaDollarSign } from "react-icons/fa";

export default function SolutionSectionC({ node, ctx }: any) {
  const benefits = [
    {
      icon: FaBolt,
      title: "Быстро",
      subtitle: "7 дней",
      description: "не месяцы",
    },
    {
      icon: FaDollarSign,
      title: "Честно",
      subtitle: "Фикс. цена",
      description: "без доплат",
    },
    {
      icon: FaShieldAlt,
      title: "Надёжно",
      subtitle: "Поддержка",
      description: "навсегда",
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-background to-foreground-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Есть другой путь: Продуктовый конвейер
          </h2>
          <p className="text-lg text-foreground-600 max-w-3xl mx-auto">
            Мы не студия. Не фрилансер. Не конструктор.
            <br />
            Мы — система, которая запускает сайты за 7 дней.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="flex flex-col gap-3 p-3 rounded-4xl bg-background">
                <CardBody className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon className="text-3xl text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-lg font-semibold text-primary mb-1">
                    {benefit.subtitle}
                  </p>
                  <p className="text-sm text-foreground-500">{benefit.description}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-lg text-foreground-600 max-w-2xl mx-auto">
            Как IKEA для сайтов: готовые модули, быстрая сборка,
            <br />
            гарантированный результат.
          </p>
        </div>
      </div>
    </section>
  );
}
