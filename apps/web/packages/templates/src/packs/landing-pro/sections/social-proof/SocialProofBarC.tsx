"use client";

import { Card } from "@heroui/react";

export default function SocialProofBarC({ node, ctx }: any) {
  // Placeholder логотипы - можно заменить на реальные
  const logos = [
    { name: "Client 1", src: "/img/placeholders/logo-1.svg" },
    { name: "Client 2", src: "/img/placeholders/logo-2.svg" },
    { name: "Client 3", src: "/img/placeholders/logo-3.svg" },
    { name: "Client 4", src: "/img/placeholders/logo-4.svg" },
    { name: "Client 5", src: "/img/placeholders/logo-5.svg" },
    { name: "Client 6", src: "/img/placeholders/logo-6.svg" },
  ];

  return (
    <section className="w-full bg-foreground-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6">
          {logos.map((logo, index) => (
            <Card
              key={index}
              className="flex flex-col gap-3 p-3 rounded-4xl opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-24 h-16 bg-foreground-100 rounded-[21px] flex items-center justify-center">
                <span className="text-xs text-foreground-500 font-semibold">{logo.name}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Text */}
        <p className="text-center text-foreground-600 text-sm md:text-base">
          Нам доверяют клиники, юридические компании и салоны красоты
        </p>

        {/* Alternative: Numbers if no logos */}
        {/* <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">150+</div>
            <div className="text-sm text-foreground-600">сайтов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">12</div>
            <div className="text-sm text-foreground-600">городов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">47</div>
            <div className="text-sm text-foreground-600">ниш</div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
