"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { HiPlay } from "react-icons/hi2";

export default function HeroSectionC({ node, ctx }: any) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handlePrimaryCTA = () => {
    // Открыть модалку с формой
    const formElement = document.getElementById("contact-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
    // Аналитика
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "hero_cta_click", {
        button_type: "primary",
      });
    }
  };

  const handleSecondaryCTA = () => {
    setIsVideoOpen(true);
    // Аналитика
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "hero_cta_click", {
        button_type: "secondary",
      });
      (window as any).gtag("event", "hero_video_play");
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center bg-primary-gradient py-20 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Сайт с системой заявок за 7 дней
              </h1>
              <p className="text-lg md:text-xl text-foreground-600">
                Фиксированная цена • Без сюрпризов • С поддержкой
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                color="primary"
                size="lg"
                onPress={handlePrimaryCTA}
                className="font-semibold text-lg px-8 bg-primary-gradient"
              >
                Получить предложение
              </Button>
              <Button
                variant="bordered"
                size="lg"
                onPress={handleSecondaryCTA}
                startContent={<HiPlay className="text-xl" />}
                className="font-semibold text-lg px-8"
              >
                Смотреть демо
              </Button>
            </div>

            {/* Social Proof Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-4xl shadow-sm border border-foreground-200">
                <FaCheck className="text-primary text-xs" />
                <span className="text-xs font-semibold">150+ запущенных сайтов</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-4xl shadow-sm border border-foreground-200">
                <FaCheck className="text-primary text-xs" />
                <span className="text-xs font-semibold">87% клиентов остаются &gt;1 года</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-4xl shadow-sm border border-foreground-200">
                <FaCheck className="text-primary text-xs" />
                <span className="text-xs font-semibold">Средний рост заявок: +180%</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative bg-background rounded-4xl shadow-2xl overflow-hidden border border-foreground-200">
              {/* Placeholder для скриншота/видео */}
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-primary-gradient rounded-full flex items-center justify-center">
                    <HiPlay className="text-4xl text-white ml-1" />
                  </div>
                  <p className="text-foreground-600 font-semibold text-sm">Демо-сайт</p>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-primary-gradient text-white px-4 py-2 rounded-4xl text-xs font-semibold">
                Демо-сайт
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="bg-background rounded-4xl p-4 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-foreground-100 rounded-[21px] flex items-center justify-center">
              <p className="text-foreground-600 text-sm">Видео будет здесь</p>
            </div>
            <Button
              className="mt-4 w-full"
              onPress={() => setIsVideoOpen(false)}
            >
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
