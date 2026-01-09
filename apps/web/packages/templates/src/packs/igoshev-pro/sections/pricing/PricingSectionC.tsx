"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSectionC({ node, ctx }: any) {
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<"monthly" | "3months" | "12months">("monthly");
  
  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const plans = [
    {
      name: "LITE",
      price: "9 900₽",
      monthly: 1490,
      features: ["До 3 страниц", "2 формы захвата", "Telegram-уведомления", "Email-поддержка"],
      popular: false,
    },
    {
      name: "STANDARD",
      price: "19 900₽",
      monthly: 2490,
      features: ["До 7 страниц", "До 5 форм", "CRM-интеграция", "Яндекс.Метрика", "Telegram-поддержка"],
      popular: true,
    },
    {
      name: "PRO",
      price: "34 900₽",
      monthly: 3990,
      features: ["До 12 страниц", "Премиум дизайн", "Все интеграции", "Приоритетная поддержка"],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-20 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Прозрачные тарифы
        </motion.h2>

        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <button
              onClick={() => setSubscriptionPeriod("monthly")}
              className={`px-6 py-2 rounded-full transition-all ${
                subscriptionPeriod === "monthly"
                  ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Помесячно
            </button>
            <button
              onClick={() => setSubscriptionPeriod("3months")}
              className={`px-6 py-2 rounded-full transition-all relative ${
                subscriptionPeriod === "3months"
                  ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              3 месяца
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#34C759] text-white text-xs rounded-full">
                -10%
              </span>
            </button>
            <button
              onClick={() => setSubscriptionPeriod("12months")}
              className={`px-6 py-2 rounded-full transition-all relative ${
                subscriptionPeriod === "12months"
                  ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              12 месяцев
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#34C759] text-white text-xs rounded-full">
                -30%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const monthlyPrice = plan.monthly;
            const threeMonthsPrice = Math.round(monthlyPrice * 3 * 0.9);
            const twelveMonthsPrice = Math.round(monthlyPrice * 12 * 0.7);

            let displayPrice = `${monthlyPrice}₽/мес`;
            let originalPrice = null;

            if (subscriptionPeriod === "3months") {
              displayPrice = `${threeMonthsPrice}₽`;
              originalPrice = `${monthlyPrice * 3}₽`;
            } else if (subscriptionPeriod === "12months") {
              displayPrice = `${twelveMonthsPrice}₽`;
              originalPrice = `${monthlyPrice * 12}₽`;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white/5 backdrop-blur-xl border rounded-4xl p-8 ${
                  plan.popular
                    ? "border-[#34C759]/50 scale-105 bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10"
                    : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full text-sm font-semibold">
                      Популярный
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
                <div className="mb-6">
                  {originalPrice && <div className="text-gray-500 line-through text-sm mb-1">+ {originalPrice}</div>}
                  <div className="text-gray-400">
                    + {displayPrice}
                    {subscriptionPeriod === "3months" && " за 3 мес"}
                    {subscriptionPeriod === "12months" && " за 12 мес"}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="text-[#34C759] shrink-0" size={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => smoothScroll("cta")}
                  className={
                    plan.popular
                      ? "w-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 rounded-full"
                      : "w-full bg-white/10 hover:bg-white/20 rounded-full"
                  }
                >
                  Выбрать
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
