"use client";

import { motion } from "framer-motion";

export default function CaseStudiesSectionC({ node, ctx }: any) {
  const cases = [
    {
      company: "Стоматология Smile",
      location: "Москва",
      before: "12 заявок/мес",
      after: "47 заявок/мес",
      result: "+292%",
      quote: "Главное — не ждали 3 месяца",
      author: "Анна, владелец",
    },
    {
      company: "Юридическая фирма Право",
      location: "Санкт-Петербург",
      before: "8 заявок/мес",
      after: "31 заявка/мес",
      result: "+287%",
      quote: "Профессиональный подход",
      author: "Сергей, партнёр",
    },
    {
      company: "Салон красоты Миа",
      location: "Казань",
      before: "15 заявок/мес",
      after: "52 заявки/мес",
      result: "+247%",
      quote: "Окупили за первый месяц",
      author: "Елена, директор",
    },
  ];

  return (
    <section id="cases" className="relative py-20 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Результаты клиентов
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cases.map((caseStudy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6"
            >
              <div className="aspect-video bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 rounded-3xl mb-4" />

              <h3 className="text-xl font-bold mb-1">{caseStudy.company}</h3>
              <p className="text-sm text-gray-400 mb-4">{caseStudy.location}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <div className="text-xs text-gray-400 mb-1">До</div>
                  <div className="font-semibold">{caseStudy.before}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">После</div>
                  <div className="font-semibold text-[#34C759]">{caseStudy.after}</div>
                </div>
              </div>

              <div className="text-3xl font-bold text-center text-[#34C759] mb-4">{caseStudy.result}</div>

              <blockquote className="border-l-2 border-[#34C759] pl-4 italic text-gray-300 mb-2">
                "{caseStudy.quote}"
              </blockquote>
              <p className="text-sm text-gray-400">— {caseStudy.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
