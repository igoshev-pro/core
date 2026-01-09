"use client";

import { Accordion, AccordionItem, Card } from "@heroui/react";
import { Button } from "@heroui/react";

export default function FAQSectionC({ node, ctx }: any) {
  const faqs = [
    {
      question: "Что если не понравится результат?",
      answer:
        "Мы работаем до тех пор, пока вы не будете довольны результатом. Если в течение 30 дней после запуска при наличии трафика не будет заявок, вернем деньги за подписку.",
    },
    {
      question: "Что входит в подписку?",
      answer:
        "В подписку входит: хостинг, SSL-сертификат, техническая поддержка, обновления безопасности, резервное копирование. Вам не нужно думать о технической части — мы берём это на себя.",
    },
    {
      question: "Можно ли потом перейти на другой тариф?",
      answer:
        "Да, вы можете в любой момент перейти на другой тариф. Разница в стоимости будет пересчитана пропорционально.",
    },
    {
      question: "Что будет, если я захочу уйти?",
      answer:
        "Вы можете в любой момент прекратить подписку. Мы передадим вам все файлы сайта и поможем с миграцией, если потребуется.",
    },
    {
      question: "Нужно ли мне предоставлять тексты и фото?",
      answer:
        "Желательно, но не обязательно. Мы можем подготовить тексты и подобрать фото за дополнительную плату, или вы можете предоставить свои материалы.",
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Частые вопросы
        </h2>

        <Card className="rounded-4xl">
          <Accordion variant="bordered" className="mb-8">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                title={<span className="text-sm font-semibold">{faq.question}</span>}
                onPress={() => {
                  if (typeof window !== "undefined" && (window as any).gtag) {
                    (window as any).gtag("event", "faq_expand", {
                      question_text: faq.question,
                    });
                  }
                }}
              >
                <p className="text-xs text-foreground-500">{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="text-center">
          <Button
            variant="bordered"
            onPress={() => {
              if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("event", "all_faq_click");
              }
            }}
          >
            Все вопросы →
          </Button>
        </div>

        {/* Schema.org микроразметка */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
