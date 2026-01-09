"use client";

import { Button, Card } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { FaClipboardList, FaHammer, FaEdit, FaRocket } from "react-icons/fa";

export default function HowItWorksSectionC({ node, ctx }: any) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      day: "День 1",
      icon: FaClipboardList,
      title: "Бриф",
      description: "30 мин звонок",
    },
    {
      day: "День 2-3",
      icon: FaHammer,
      title: "Сборка",
      description: "Разработка",
    },
    {
      day: "День 5",
      icon: FaEdit,
      title: "Ревью",
      description: "1 раунд правок",
    },
    {
      day: "День 7",
      icon: FaRocket,
      title: "Запуск",
      description: "Готово!",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Анимация появления шагов по очереди
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="w-full py-20 px-4 bg-background"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Как это работает
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-foreground-200">
            <div className="h-full bg-primary-gradient transition-all duration-1000" style={{ width: "100%" }} />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isVisible = visibleSteps.includes(index);
              return (
                <div
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  {/* Day Label */}
                  <div className="text-sm font-semibold text-foreground-600 mb-4">
                    {step.day}
                  </div>

                  {/* Icon Circle */}
                  <div className="relative mb-4">
                    <Card className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center border-4 border-background shadow-lg p-0 hover:scale-110 transition-transform duration-300">
                      <Icon className="text-3xl text-primary" />
                    </Card>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-foreground-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-foreground-600">
            Что нужно от вас: логотип, тексты, фото — или закажите у нас
          </p>
          <Button
            color="primary"
            size="lg"
            className="font-semibold bg-primary-gradient"
          >
            Начать →
          </Button>
        </div>
      </div>
    </section>
  );
}
