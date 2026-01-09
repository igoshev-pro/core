"use client";

import { Card, CardBody } from "@heroui/react";
import Link from "next/link";

export default function IndustriesSectionC({ node, ctx }: any) {
  const industries = [
    {
      emoji: "🦷",
      name: "Стоматологии",
      count: "23 сайта",
      href: "/niches/dentistry",
    },
    {
      emoji: "⚖️",
      name: "Юристы",
      count: "18 сайтов",
      href: "/niches/lawyers",
    },
    {
      emoji: "💇",
      name: "Салоны красоты",
      count: "15 сайтов",
      href: "/niches/beauty",
    },
    {
      emoji: "🔧",
      name: "Автосервис",
      count: "12 сайтов",
      href: "/niches/auto",
    },
    {
      emoji: "🏠",
      name: "Ремонт",
      count: "9 сайтов",
      href: "/niches/repair",
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Специализируемся на нишах
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {industries.map((industry, index) => (
            <Card
              key={index}
              as={Link}
              href={industry.href}
              isPressable
              className="flex flex-col gap-3 p-3 rounded-4xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onPress={() => {
                if (typeof window !== "undefined" && (window as any).gtag) {
                  (window as any).gtag("event", "industry_click", {
                    industry_name: industry.name,
                  });
                }
              }}
            >
              <CardBody className="p-4 text-center">
                <div className="text-5xl mb-3">{industry.emoji}</div>
                <h3 className="text-xs font-semibold mb-2">{industry.name}</h3>
                <p className="text-xs text-foreground-500 mb-4">
                  {industry.count}
                </p>
                <span className="text-xs text-primary font-semibold">
                  Пример →
                </span>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-foreground-600">
            Не нашли свою нишу? Напишите — обсудим
          </p>
        </div>
      </div>
    </section>
  );
}
