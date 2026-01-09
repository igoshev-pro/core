"use client";

import { motion } from "framer-motion";

export default function GuaranteesSectionC({ node, ctx }: any) {
  const guarantees = [
    {
      icon: "🗓",
      title: "7 дней",
      description: "Запуск за 7 рабочих дней или возврат 100% оплаты",
    },
    {
      icon: "💵",
      title: "Фикс. цена",
      description: "Цена в договоре = цена в счёте. Никаких доплат",
    },
    {
      icon: "🔄",
      title: "Возврат денег",
      description: "Если за 30 дней нет заявок при наличии трафика — возврат",
    },
  ];

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Гарантии без звёздочек
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-br from-[#34C759]/5 to-[#00C7BE]/5 backdrop-blur-xl border border-[#34C759]/20 rounded-4xl p-8 text-center"
            >
              <div className="text-5xl mb-4 filter drop-shadow-[0_0_20px_rgba(52,199,89,0.5)]">{guarantee.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-[#34C759]">{guarantee.title}</h3>
              <p className="text-gray-300">{guarantee.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
