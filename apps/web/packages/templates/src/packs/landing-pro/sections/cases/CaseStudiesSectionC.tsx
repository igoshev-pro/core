"use client";

import { Card, CardBody, Divider } from "@heroui/react";
import { Button } from "@heroui/react";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function CaseStudiesSectionC({ node, ctx }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cases = [
    {
      name: "Стоматология Smile",
      city: "Москва",
      image: "/img/placeholders/case-1.jpg",
      before: "12 заявок/мес",
      after: "47 заявок/мес",
      growth: "+292%",
      days: "6 дней",
      tariff: "Growth",
      quote: "Главное — не ждали 3 месяца. Реклама запустилась в срок, лиды пошли сразу.",
      author: "Анна, владелец",
    },
    {
      name: "Юридическая компания Право",
      city: "Санкт-Петербург",
      image: "/img/placeholders/case-2.jpg",
      before: "8 заявок/мес",
      after: "34 заявок/мес",
      growth: "+325%",
      days: "7 дней",
      tariff: "Scale",
      quote: "Все работает как часы. Поддержка на высшем уровне.",
      author: "Игорь, директор",
    },
    {
      name: "Салон красоты Элегант",
      city: "Казань",
      image: "/img/placeholders/case-3.jpg",
      before: "15 заявок/мес",
      after: "52 заявок/мес",
      growth: "+247%",
      days: "5 дней",
      tariff: "Starter",
      quote: "Быстро, качественно, без лишних вопросов. Рекомендую!",
      author: "Мария, владелец",
    },
  ];

  const nextCase = () => {
    setCurrentIndex((prev) => (prev + 1) % cases.length);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "carousel_navigation", {
        direction: "next",
      });
    }
  };

  const prevCase = () => {
    setCurrentIndex((prev) => (prev - 1 + cases.length) % cases.length);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "carousel_navigation", {
        direction: "prev",
      });
    }
  };

  const currentCase = cases[currentIndex];

  return (
    <section className="w-full py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Результаты наших клиентов
        </h2>

        <div className="relative">
          <Card className="flex flex-col gap-3 p-3 rounded-4xl overflow-hidden">
            <CardBody className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 aspect-video md:aspect-auto flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="text-6xl">📸</div>
                    <p className="text-foreground-600 text-sm">Скриншот сайта</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-7 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{currentCase.name}</h3>
                    <p className="text-foreground-600">{currentCase.city}</p>
                  </div>

                  <div className="flex flex-col gap-3 p-4 px-4 rounded-[21px]">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <p className="text-foreground-500">Было:</p>
                      <p className="font-semibold">{currentCase.before}</p>
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <p className="text-foreground-500">Стало:</p>
                      <p className="font-semibold text-primary">
                        {currentCase.after}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs">
                    <div className="bg-primary-50 text-primary px-4 py-2 rounded-4xl font-semibold">
                      {currentCase.growth} заявок
                    </div>
                    <div className="bg-foreground-100 px-4 py-2 rounded-4xl">
                      Запуск: {currentCase.days}
                    </div>
                    <div className="bg-foreground-100 px-4 py-2 rounded-4xl">
                      Тариф: {currentCase.tariff}
                    </div>
                  </div>

                  <blockquote className="border-l-4 border-primary pl-4 py-2">
                    <p className="text-foreground-700 italic mb-2">
                      "{currentCase.quote}"
                    </p>
                    <cite className="text-sm text-foreground-600">
                      — {currentCase.author}
                    </cite>
                  </blockquote>

                  <Button
                    variant="bordered"
                    onPress={() => {
                      if (typeof window !== "undefined" && (window as any).gtag) {
                        (window as any).gtag("event", "case_study_click", {
                          case_name: currentCase.name,
                        });
                      }
                    }}
                  >
                    Читать кейс →
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              isIconOnly
              variant="light"
              onPress={prevCase}
              aria-label="Previous case"
            >
              <FaChevronLeft />
            </Button>
            <div className="flex gap-2">
              {cases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-foreground-300"
                  }`}
                  aria-label={`Go to case ${index + 1}`}
                />
              ))}
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={nextCase}
              aria-label="Next case"
            >
              <FaChevronRight />
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="bordered"
            onPress={() => {
              if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("event", "all_cases_click");
              }
            }}
          >
            Все кейсы →
          </Button>
        </div>
      </div>
    </section>
  );
}
