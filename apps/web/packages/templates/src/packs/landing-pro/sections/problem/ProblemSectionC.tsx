"use client";

import React from "react";
import { Card, CardBody, Divider } from "@heroui/react";

export default function ProblemSectionC({ node, ctx }: any) {
  const problems = [
    {
      emoji: "😤",
      title: "Веб-студия",
      issues: [
        "300К и выше",
        "3-6 месяцев",
        "Куча правок",
        "Доплаты",
      ],
      stat: "40% срывают сроки",
    },
    {
      emoji: "😰",
      title: "Фрилансер",
      issues: [
        "Пропал",
        "Сроки срывает",
        "Без поддержки",
        "Нет гарантий",
      ],
      stat: "56% не в срок",
    },
    {
      emoji: "😵",
      title: "Конструктор",
      issues: [
        "Сложно",
        "Медленный",
        "Шаблонный",
        "Без помощи",
      ],
      stat: "53% уходят с сайта",
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Знакомо?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map((problem, index) => (
            <Card
              key={index}
              className="flex flex-col gap-3 p-3 rounded-4xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              isPressable
              onPress={() => {
                if (typeof window !== "undefined" && (window as any).gtag) {
                  (window as any).gtag("event", "problem_card_hover", {
                    card_type: problem.title,
                  });
                }
              }}
            >
              <CardBody className="p-4">
                <div className="text-5xl mb-4 text-center">{problem.emoji}</div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  {problem.title}
                </h3>
                <div className="flex flex-col gap-3 p-4 px-4 rounded-[21px]">
                  {problem.issues.map((issue, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-foreground-600">{issue}</span>
                      </div>
                      {i !== problem.issues.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-foreground-200">
                  <p className="text-xs text-foreground-500 text-center">
                    {problem.stat}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <p className="text-xs text-foreground-400 text-center mt-8">
          * Источники статистики: внутренние исследования рынка
        </p>
      </div>
    </section>
  );
}
