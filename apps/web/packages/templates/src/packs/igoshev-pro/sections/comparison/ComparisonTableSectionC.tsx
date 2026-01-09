"use client";

import { motion } from "framer-motion";

export default function ComparisonTableSectionC({ node, ctx }: any) {
  return (
    <section className="relative py-20 px-4 bg-white/5">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Честное сравнение
        </motion.h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400"></th>
                <th className="text-center py-4 px-4">Фрилансер</th>
                <th className="text-center py-4 px-4">Студия</th>
                <th className="text-center py-4 px-4">Конструктор</th>
                <th className="text-center py-4 px-4 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 rounded-t-4xl">
                  <span className="font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                    Мы
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-4 px-4 font-semibold">Срок</td>
                <td className="text-center py-4 px-4">1-3 мес</td>
                <td className="text-center py-4 px-4">2-6 мес</td>
                <td className="text-center py-4 px-4">1-4 нед</td>
                <td className="text-center py-4 px-4 bg-[#34C759]/5">
                  <span className="text-[#34C759] font-bold">7 дней ✓</span>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-4 px-4 font-semibold">Цена</td>
                <td className="text-center py-4 px-4">30-80К</td>
                <td className="text-center py-4 px-4">150-500К</td>
                <td className="text-center py-4 px-4">0-15К</td>
                <td className="text-center py-4 px-4 bg-[#34C759]/5">
                  <span className="text-[#34C759] font-bold">от 9 900₽</span>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-4 px-4 font-semibold">Риск срыва</td>
                <td className="text-center py-4 px-4">56% 🔴</td>
                <td className="text-center py-4 px-4">40% 🟡</td>
                <td className="text-center py-4 px-4">Низкий</td>
                <td className="text-center py-4 px-4 bg-[#34C759]/5">
                  <span className="text-[#34C759] font-bold">0% ✓</span>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-4 px-4 font-semibold">Поддержка</td>
                <td className="text-center py-4 px-4">❌</td>
                <td className="text-center py-4 px-4">💰</td>
                <td className="text-center py-4 px-4">FAQ</td>
                <td className="text-center py-4 px-4 bg-[#34C759]/5">
                  <span className="text-[#34C759] font-bold">✓ Включена</span>
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-4 px-4 font-semibold">Гарантии</td>
                <td className="text-center py-4 px-4">❌</td>
                <td className="text-center py-4 px-4">Договор</td>
                <td className="text-center py-4 px-4">❌</td>
                <td className="text-center py-4 px-4 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 rounded-b-4xl">
                  <span className="text-[#34C759] font-bold">✓ Возврат</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
