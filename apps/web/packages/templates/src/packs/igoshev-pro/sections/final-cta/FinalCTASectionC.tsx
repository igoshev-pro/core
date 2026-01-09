"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function FinalCTASectionC({ node, ctx }: any) {
  return (
    <section id="cta" className="relative py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Готовы запустить сайт за 7 дней?</h2>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Имя *
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34C759] backdrop-blur"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Телефон *
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34C759] backdrop-blur"
                placeholder="+7 (___) ___-__-__"
              />
            </div>

            <div>
              <label htmlFor="niche" className="block text-sm font-medium mb-2">
                Ниша
              </label>
              <select
                id="niche"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34C759] backdrop-blur"
              >
                <option value="">Выберите нишу</option>
                <option value="dentistry">Стоматология</option>
                <option value="legal">Юридические услуги</option>
                <option value="beauty">Салон красоты</option>
                <option value="auto">Автосервис</option>
                <option value="repair">Ремонт</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Комментарий
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34C759] backdrop-blur resize-none"
                placeholder="Расскажите о вашем проекте"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/50 transition-all text-lg rounded-full"
            >
              Получить предложение
            </Button>

            <p className="text-center text-sm text-gray-400">Перезвоним в течение 30 минут в рабочее время</p>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-3">или напишите в</p>
              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Telegram
                </a>
                <a
                  href="#"
                  className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
