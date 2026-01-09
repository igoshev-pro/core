"use client";

import React from "react";
import { Card, CardBody, Divider } from "@heroui/react";
import { Button } from "@heroui/react";
import { FaCheck, FaStar } from "react-icons/fa6";

export default function PricingPreviewSectionC({ node, ctx }: any) {
  const plans = [
    {
      name: "STARTER",
      price: "19 000 ₽",
      monthly: "+4 900/мес",
      popular: false,
      features: [
        "5 страниц",
        "3 формы",
        "Telegram",
        "Email поддержка",
      ],
    },
    {
      name: "GROWTH",
      price: "35 000 ₽",
      monthly: "+8 900/мес",
      popular: true,
      features: [
        "10 страниц",
        "∞ форм",
        "CRM",
        "Аналитика",
        "Чат",
      ],
    },
    {
      name: "SCALE",
      price: "55 000 ₽",
      monthly: "+14 900/мес",
      popular: false,
      features: [
        "∞ страниц",
        "∞ форм",
        "3 CRM",
        "A/B тесты",
        "Менеджер",
      ],
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-foreground-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Прозрачные тарифы
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col gap-3 p-3 rounded-4xl relative ${
                plan.popular ? "border-2 border-primary shadow-xl scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-gradient text-white px-4 py-2 rounded-4xl text-xs font-semibold flex items-center gap-1">
                  <FaStar className="text-xs" />
                  Popular
                </div>
              )}
              <CardBody className="p-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-semibold text-primary mb-1">
                    {plan.price}
                  </div>
                  <div className="text-xs text-foreground-500">
                    {plan.monthly}
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4 px-4 rounded-[21px] mb-6">
                  {plan.features.map((feature, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <p className="flex items-center gap-2">
                          <FaCheck className="text-primary text-xs flex-shrink-0" />
                          <span>{feature}</span>
                        </p>
                      </div>
                      {i !== plan.features.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </div>

                <Button
                  color={plan.popular ? "primary" : "default"}
                  variant={plan.popular ? "solid" : "bordered"}
                  className={`w-full font-semibold ${plan.popular ? "bg-primary-gradient" : ""}`}
                  onPress={() => {
                    if (typeof window !== "undefined" && (window as any).gtag) {
                      (window as any).gtag("event", "pricing_card_click", {
                        tariff: plan.name,
                      });
                    }
                  }}
                >
                  Выбрать
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="bordered"
            onPress={() => {
              if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("event", "calculator_link_click");
              }
            }}
          >
            Рассчитать стоимость в калькуляторе →
          </Button>
        </div>
      </div>
    </section>
  );
}
