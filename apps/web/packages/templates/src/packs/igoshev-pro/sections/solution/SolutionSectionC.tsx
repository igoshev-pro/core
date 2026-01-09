"use client";

import { motion } from "framer-motion";

export default function SolutionSectionC({ node, ctx }: any) {
  const solutions = [
    { icon: "⚡", title: "Быстро", description: "7 дней, не месяцы" },
    { icon: "💰", title: "Честно", description: "Фиксированная цена без доплат" },
    { icon: "🛡️", title: "Надёжно", description: "Поддержка включена навсегда" },
  ];

  return (
    <section className="relative py-20 px-4 bg-white/5">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-6"
        >
          Есть другой путь
        </motion.h2>

        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Мы не студия. Не фрилансер. Не конструктор. Мы — система, которая запускает сайты за 7 дней.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {solutions.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-[#34C759]/5 to-[#00C7BE]/5 backdrop-blur-xl border border-[#34C759]/20 rounded-4xl p-8 text-center"
            >
              <div className="text-5xl mb-4 filter drop-shadow-[0_0_20px_rgba(52,199,89,0.5)]">{card.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-300">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 backdrop-blur-xl border border-white/10 rounded-4xl p-6"
        >
          <p className="text-lg italic text-gray-200">
            "Как IKEA для сайтов: готовые модули, быстрая сборка, гарантированный результат."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
