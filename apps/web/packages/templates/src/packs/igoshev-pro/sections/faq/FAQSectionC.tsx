"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSectionC({ node, ctx }: any) {
  const faqs = [
    {
      question: "Как быстро вы делаете сайт?",
      answer:
        "Стандартный срок — 7 рабочих дней от получения всех материалов (логотип, тексты, фото). Если материалы нужно подготовить, мы можем помочь за дополнительную плату или вы можете предоставить их позже.",
    },
    {
      question: "Что входит в ежемесячную подписку?",
      answer:
        "Хостинг, SSL-сертификат, техподдержка, резервное копирование, обновления безопасности и небольшие правки контента (до 30 минут работы в месяц).",
    },
    {
      question: "Можно ли потом изменить тариф?",
      answer:
        "Да, вы можете перейти на другой тариф в любой момент. При повышении тарифа доплачиваете разницу, при понижении — новая цена начнет действовать со следующего платежного периода.",
    },
    {
      question: "Что если мне не понравится результат?",
      answer:
        "У вас есть 1 раунд правок, включенный в стоимость. Если результат всё равно не устроит, мы вернём 100% оплаты — без вопросов и звёздочек.",
    },
    {
      question: "Нужно ли мне предоставлять тексты и фото?",
      answer:
        "В идеале да, так сайт будет максимально персонализированным. Но мы можем помочь с контентом: написать тексты, подобрать стоковые фото или организовать фотосъёмку за дополнительную плату.",
    },
    {
      question: "Что будет, если я захочу уйти?",
      answer:
        "Без проблем. Предупредите за 30 дней, и мы поможем с миграцией сайта на другой хостинг. Все исходники и доступы — ваши.",
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-white/5">
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Частые вопросы
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-6 data-[state=open]:border-[#34C759]/30"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="text-left font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-300">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
