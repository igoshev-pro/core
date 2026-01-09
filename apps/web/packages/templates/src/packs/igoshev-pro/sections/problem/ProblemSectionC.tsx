"use client";

import { motion } from "framer-motion";

export default function ProblemSectionC({ node, ctx }: any) {
  const problems = [
    {
      emoji: "😤",
      title: "Веб-студия",
      items: ["300К и выше", "3-6 месяцев", "Бесконечные правки", "Доплаты за всё"],
      badge: "40% срывают сроки",
    },
    {
      emoji: "😰",
      title: "Фрилансер",
      items: ["Пропадает без вести", "Срывает сроки", "Нет поддержки", "Нет гарантий"],
      badge: "56% не в срок",
    },
    {
      emoji: "😵",
      title: "Конструктор",
      items: ["Сложный интерфейс", "Медленная загрузка", "Шаблонный дизайн", "Без помощи"],
      badge: "53% уходят с сайта",
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
          Знакомо?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-4xl p-6 relative"
            >
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full text-xs font-semibold">
                  {card.badge}
                </span>
              </div>
              <div className="text-4xl mb-4">{card.emoji}</div>
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
