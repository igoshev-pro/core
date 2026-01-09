"use client";

import { Card } from "@heroui/react";
import Image from "next/image";

export default function SocialProofBarC({ node, ctx }: any) {
  // Placeholder логотипы - можно заменить на реальные
  const logos = [
    { name: "Client 1", src: "/img/system/bc.svg" },
    { name: "Client 2", src: "/img/system/s.svg" },
    { name: "Client 4", src: "/img/system/moya.svg" },
    { name: "Client 3", src: "/img/system/allur.png" },
    { name: "Client 6", src: "/img/system/21.svg" },
    { name: "Client 5", src: "/img/system/nat.svg" },
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
              <div className="w-24 h-16 px-3 flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={96}
                  height={64}
                  className="w-full h-auto"
                  style={{ maxHeight: '64px', objectFit: 'contain' }}
                />
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
