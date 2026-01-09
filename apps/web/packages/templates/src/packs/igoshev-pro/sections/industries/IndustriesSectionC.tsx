"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function IndustriesSectionC({ node, ctx }: any) {
  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const industries = [
    { title: "Стоматологии", count: "23 сайта", niche: "стоматологии" },
    { title: "Юристы", count: "18 сайтов", niche: "юристы" },
    { title: "Салоны красоты", count: "15 сайтов", niche: "салоны" },
    { title: "Автосервисы", count: "12 сайтов", niche: "автосервисы" },
    { title: "Ремонт", count: "9 сайтов", niche: "ремонт" },
  ];

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Специализируемся на нишах
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 text-center cursor-pointer group"
            >
              <h3 className="text-xl font-bold mb-2">{industry.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{industry.count}</p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#34C759]/30 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 hover:from-[#34C759]/20 hover:to-[#00C7BE]/20 hover:border-[#34C759]/50 backdrop-blur text-white rounded-full w-full group-hover:shadow-lg group-hover:shadow-[#34C759]/30 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/niches/${industry.niche}`;
                }}
              >
                Пример
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-300 text-lg"
        >
          Не нашли свою нишу?{" "}
          <button
            onClick={() => smoothScroll("cta")}
            className="text-[#34C759] hover:text-[#00C7BE] transition-colors underline font-semibold"
          >
            Напишите — обсудим
          </button>
        </motion.p>
      </div>
    </section>
  );
}
