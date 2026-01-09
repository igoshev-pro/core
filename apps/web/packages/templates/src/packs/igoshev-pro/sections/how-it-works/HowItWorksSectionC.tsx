"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HowItWorksSectionC({ node, ctx }: any) {
  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const steps = [
    { day: "День 1", icon: "📋", title: "Бриф", description: "30-минутный звонок" },
    { day: "День 2-4", icon: "🔨", title: "Сборка", description: "Создаём ваш сайт" },
    { day: "День 5-6", icon: "✏️", title: "Ревью", description: "1 раунд правок" },
    { day: "День 7", icon: "🚀", title: "Запуск", description: "Сайт в работе" },
  ];

  return (
    <section id="how-it-works" className="relative py-20 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Как это работает
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#34C759]/50 via-[#00C7BE]/50 to-[#34C759]/50" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 text-center z-10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#34C759] to-[#00C7BE] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                {step.icon}
              </div>
              <div className="text-sm text-[#34C759] mb-2">{step.day}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-300 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-300 mb-6">Что нужно от вас: логотип, тексты, фото — или закажите у нас</p>
          <Button
            onClick={() => smoothScroll("cta")}
            className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 rounded-full"
          >
            Начать <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
