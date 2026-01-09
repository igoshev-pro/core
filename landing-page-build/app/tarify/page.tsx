"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, X, ChevronRight, ChevronLeft, MessageCircle } from "lucide-react"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [calculatorStep, setCalculatorStep] = useState(1)
  const [calculatorData, setCalculatorData] = useState({
    pages: "",
    features: [] as string[],
    timeline: "",
  })
  const [showConsultModal, setShowConsultModal] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const plans = [
    {
      name: "LITE",
      label: "Для старта",
      setup: 9900,
      monthly: 1490,
      yearly: 14900,
      features: [
        "До 5 страниц",
        "3 формы захвата",
        "Мобильная версия",
        "SSL-сертификат",
        "Telegram-уведомления",
        "Email-уведомления",
        "Яндекс.Метрика",
        "Базовая статистика",
        "Email-поддержка (48ч)",
        "Запуск за 7 дней",
        "1 раунд правок",
        "3 000 просмотров/мес",
        "1 GB хранилище",
      ],
    },
    {
      name: "STANDARD",
      label: "Оптимальный выбор",
      badge: "Популярный",
      setup: 19900,
      monthly: 2490,
      yearly: 24900,
      popular: true,
      features: [
        "До 10 страниц",
        "Безлимит форм",
        "Всё из Lite, плюс:",
        "Интеграция amoCRM или Bitrix24",
        "Google Analytics",
        "Цели и конверсии",
        "Микроразметка Schema.org",
        "Webhooks для интеграций",
        "Telegram-поддержка (24ч)",
        "2 раунда правок",
        "10 000 просмотров/мес",
        "5 GB хранилище",
      ],
    },
    {
      name: "PRO",
      label: "Для требовательных",
      setup: 34900,
      monthly: 3990,
      yearly: 39900,
      features: [
        "Безлимит страниц",
        "Всё из Standard, плюс:",
        "До 3 CRM-интеграций",
        "Roistat интеграция",
        "A/B тестирование",
        "Квиз-формы",
        "Ежемесячный отчёт",
        "Ежеквартальный SEO-аудит",
        "Выделенный менеджер",
        "Приоритетная поддержка (4ч)",
        "Запуск за 5 дней",
        "3 раунда правок",
        "50 000 просмотров/мес",
        "20 GB хранилище",
      ],
    },
  ]

  const addOns = {
    oneTime: [
      { name: "Контент-пакет", price: 15000, desc: "Тексты для 5 страниц + подбор 15 фото" },
      { name: "Дополнительный лендинг", price: 12000, desc: "Отдельная страница под акцию или услугу" },
      { name: "Интеграция YCLIENTS", price: 15000, desc: "Виджет онлайн-записи для клиник и салонов" },
      { name: "Срочный запуск", price: "+50%", desc: "Запуск за 3 дня вместо 7" },
      { name: "Миграция с другого сайта", price: 20000, desc: "Перенос контента и настройка редиректов" },
    ],
    monthly: [
      { name: "Контент-менеджмент", price: 12000, desc: "4 публикации + обновление акций и цен" },
      { name: "Ведение рекламы", price: "от 15 000", desc: "Настройка и ведение Яндекс.Директ" },
      { name: "Дополнительные просмотры", price: 3000, desc: "+20 000 просмотров к лимиту тарифа" },
    ],
  }

  const comparisonData = {
    САЙТ: [
      { feature: "Количество страниц", lite: "5", standard: "10", pro: "∞" },
      { feature: "Мобильная версия", lite: true, standard: true, pro: true },
      { feature: "SSL-сертификат", lite: true, standard: true, pro: true },
      { feature: "Скорость загрузки", lite: "<3 сек", standard: "<2 сек", pro: "<2 сек" },
      { feature: "Свой домен", lite: true, standard: true, pro: true },
    ],
    "ФОРМЫ И ЗАЯВКИ": [
      { feature: "Формы захвата", lite: "3", standard: "∞", pro: "∞" },
      { feature: "Квиз-формы", lite: false, standard: false, pro: true },
      { feature: "Уведомления Telegram", lite: true, standard: true, pro: true },
      { feature: "Уведомления Email", lite: true, standard: true, pro: true },
      { feature: "Webhooks", lite: false, standard: true, pro: true },
    ],
    ИНТЕГРАЦИИ: [
      { feature: "amoCRM", lite: false, standard: "1", pro: true },
      { feature: "Bitrix24", lite: false, standard: "1", pro: true },
      { feature: "Другие CRM", lite: false, standard: false, pro: "до 3" },
      { feature: "Яндекс.Метрика", lite: true, standard: true, pro: true },
      { feature: "Google Analytics", lite: false, standard: true, pro: true },
      { feature: "Roistat", lite: false, standard: false, pro: true },
    ],
    АНАЛИТИКА: [
      { feature: "Базовая статистика", lite: true, standard: true, pro: true },
      { feature: "Цели и конверсии", lite: false, standard: true, pro: true },
      { feature: "A/B тестирование", lite: false, standard: false, pro: true },
      { feature: "Ежемесячный отчёт", lite: false, standard: false, pro: true },
    ],
    SEO: [
      { feature: "Мета-теги", lite: true, standard: true, pro: true },
      { feature: "Sitemap", lite: true, standard: true, pro: true },
      { feature: "Микроразметка", lite: false, standard: true, pro: true },
      { feature: "Ежеквартальный аудит", lite: false, standard: false, pro: true },
    ],
    ПОДДЕРЖКА: [
      { feature: "Email", lite: "48ч", standard: "24ч", pro: "4ч" },
      { feature: "Telegram/Чат", lite: false, standard: "12ч", pro: "4ч" },
      { feature: "Выделенный менеджер", lite: false, standard: false, pro: true },
    ],
    ЗАПУСК: [
      { feature: "Срок", lite: "7 дней", standard: "7 дней", pro: "5 дней" },
      { feature: "Раунды правок", lite: "1", standard: "2", pro: "3" },
    ],
    ЛИМИТЫ: [
      { feature: "Просмотров/месяц", lite: "3 000", standard: "10 000", pro: "50 000" },
      { feature: "Хранилище", lite: "1 GB", standard: "5 GB", pro: "20 GB" },
    ],
  }

  const getRecommendedPlan = () => {
    const hasAdvancedFeatures = calculatorData.features.some((f) =>
      ["Интеграция с CRM", "A/B тестирование", "Приоритетная поддержка"].includes(f),
    )
    const needsMorePages = calculatorData.pages === "Больше 10"

    if (hasAdvancedFeatures || needsMorePages) return plans[2]
    if (calculatorData.pages === "6-10" || calculatorData.features.length > 1) return plans[1]
    return plans[0]
  }

  const calculateTotal = () => {
    const plan = getRecommendedPlan()
    let addOnsCost = 0

    if (calculatorData.features.includes("Онлайн-запись (YCLIENTS)")) addOnsCost += 15000
    if (calculatorData.timeline === "Срочно (3-5 дней)") addOnsCost += plan.setup * 0.5

    return {
      plan: plan.name,
      setup: plan.setup,
      monthly: billingPeriod === "yearly" ? plan.yearly : plan.monthly,
      addOns: addOnsCost,
      total: plan.setup + addOnsCost,
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white overflow-x-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#34C759]/20 via-[#00C7BE]/20 to-[#34C759]/10 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 py-3"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              WebConveyor
            </a>
            <Button
              onClick={() => setShowConsultModal(true)}
              className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 transition-all text-white rounded-full"
            >
              Получить консультацию
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 pt-28">
        {/* 1. HERO */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Breadcrumbs */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 mb-8">
              <a href="/" className="text-sm text-gray-400 hover:text-[#34C759] transition-colors">
                Главная
              </a>
              <ChevronRight size={14} className="text-gray-600" />
              <span className="text-sm text-white">Тарифы</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Выберите подходящий тариф</h1>
            <p className="text-xl text-gray-400 mb-12 text-pretty">
              Прозрачные цены без скрытых платежей. Всё включено.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-6 py-3 rounded-full transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] shadow-lg shadow-[#34C759]/30"
                    : "text-gray-400"
                }`}
              >
                Оплата помесячно
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-6 py-3 rounded-full transition-all relative ${
                  billingPeriod === "yearly"
                    ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] shadow-lg shadow-[#34C759]/30"
                    : "text-gray-400"
                }`}
              >
                Оплата за год
                {billingPeriod === "yearly" && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white text-xs px-2 py-1 rounded-full">
                    -17%
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </section>

        {/* 2. PRICING CARDS */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 ${
                  plan.popular ? "md:scale-105 md:shadow-2xl md:shadow-[#34C759]/20 border-[#34C759]/30" : ""
                } hover:border-[#34C759]/30 transition-all`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white text-sm px-4 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-8">
                  <p className="text-sm text-gray-400 mb-2">{plan.label}</p>
                  <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-400">Запуск</p>
                      <p className="text-2xl font-bold">{plan.setup.toLocaleString()} ₽</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Подписка</p>
                      {billingPeriod === "monthly" ? (
                        <p className="text-2xl font-bold text-[#34C759]">{plan.monthly.toLocaleString()} ₽/мес</p>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-[#34C759]">{plan.yearly.toLocaleString()} ₽/год</p>
                          <p className="text-sm text-gray-500 line-through">{(plan.monthly * 12).toLocaleString()} ₽</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-[#34C759] shrink-0 mt-0.5" />
                      <span className={feature.startsWith("Всё из") ? "text-gray-400 italic" : ""}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setShowConsultModal(true)}
                  className={`w-full rounded-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Выбрать {plan.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. COMPARISON MATRIX */}
        <section className="container mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Детальное сравнение тарифов</h2>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 overflow-x-auto">
              {Object.entries(comparisonData).map(([category, rows]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between py-3 border-b border-white/10 hover:text-[#34C759] transition-colors"
                  >
                    <h3 className="text-lg font-bold">{category}</h3>
                    <ChevronRight
                      className={`transition-transform ${expandedCategories.includes(category) ? "rotate-90" : ""}`}
                    />
                  </button>

                  {expandedCategories.includes(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <table className="w-full mt-4">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 text-sm text-gray-400">Функция</th>
                            <th className="text-center py-3 text-sm">Lite</th>
                            <th className="text-center py-3 text-sm">Standard</th>
                            <th className="text-center py-3 text-sm bg-white/5 rounded-t-xl">Pro</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 text-sm">{row.feature}</td>
                              <td className="text-center py-3 text-sm">
                                {typeof row.lite === "boolean" ? (
                                  row.lite ? (
                                    <Check size={16} className="inline text-[#34C759]" />
                                  ) : (
                                    <span className="text-gray-600">—</span>
                                  )
                                ) : (
                                  row.lite
                                )}
                              </td>
                              <td className="text-center py-3 text-sm">
                                {typeof row.standard === "boolean" ? (
                                  row.standard ? (
                                    <Check size={16} className="inline text-[#34C759]" />
                                  ) : (
                                    <span className="text-gray-600">—</span>
                                  )
                                ) : (
                                  row.standard
                                )}
                              </td>
                              <td className="text-center py-3 text-sm bg-white/5">
                                {typeof row.pro === "boolean" ? (
                                  row.pro ? (
                                    <Check size={16} className="inline text-[#34C759]" />
                                  ) : (
                                    <span className="text-gray-600">—</span>
                                  )
                                ) : (
                                  row.pro
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 4. ADD-ONS */}
        <section className="container mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Дополнительные услуги</h2>
            <p className="text-center text-gray-400 mb-12">Расширьте возможности любого тарифа</p>

            <div className="space-y-8">
              {/* One-time services */}
              <div>
                <h3 className="text-xl font-bold mb-6">Разовые услуги</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addOns.oneTime.map((addon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 hover:border-[#34C759]/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold">{addon.name}</h4>
                        <span className="text-[#34C759] font-bold whitespace-nowrap ml-2">
                          {typeof addon.price === "number" ? `${addon.price.toLocaleString()} ₽` : addon.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{addon.desc}</p>
                      <Button
                        onClick={() => setShowConsultModal(true)}
                        variant="outline"
                        className="w-full rounded-full border-white/20 hover:border-[#34C759]/50"
                      >
                        Заказать
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Monthly services */}
              <div>
                <h3 className="text-xl font-bold mb-6">Ежемесячные услуги</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addOns.monthly.map((addon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 hover:border-[#34C759]/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold">{addon.name}</h4>
                        <span className="text-[#34C759] font-bold whitespace-nowrap ml-2">
                          {typeof addon.price === "number" ? `${addon.price.toLocaleString()} ₽/мес` : addon.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{addon.desc}</p>
                      <Button
                        onClick={() => setShowConsultModal(true)}
                        variant="outline"
                        className="w-full rounded-full border-white/20 hover:border-[#34C759]/50"
                      >
                        Заказать
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 5. CALCULATOR */}
        <section className="container mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Рассчитайте стоимость</h2>
            <p className="text-center text-gray-400 mb-12">Подберём оптимальный тариф под ваши задачи</p>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      calculatorStep === step
                        ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE]"
                        : calculatorStep > step
                          ? "bg-[#34C759]"
                          : "bg-white/10"
                    }`}
                  >
                    {calculatorStep > step ? <Check size={20} /> : step}
                  </div>
                ))}
              </div>

              {/* Step 1 */}
              {calculatorStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Сколько страниц нужно?</h3>
                  <div className="space-y-3">
                    {["До 5", "6-10", "Больше 10"].map((option) => (
                      <button
                        key={option}
                        onClick={() => setCalculatorData({ ...calculatorData, pages: option })}
                        className={`w-full p-4 rounded-full border transition-all ${
                          calculatorData.pages === option
                            ? "border-[#34C759] bg-[#34C759]/10"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => setCalculatorStep(2)}
                      disabled={!calculatorData.pages}
                      className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full"
                    >
                      Далее <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {calculatorStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Какие функции важны?</h3>
                  <div className="space-y-3">
                    {[
                      "Интеграция с CRM",
                      "Онлайн-запись (YCLIENTS)",
                      "Расширенная аналитика",
                      "A/B тестирование",
                      "Приоритетная поддержка",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          const newFeatures = calculatorData.features.includes(option)
                            ? calculatorData.features.filter((f) => f !== option)
                            : [...calculatorData.features, option]
                          setCalculatorData({ ...calculatorData, features: newFeatures })
                        }}
                        className={`w-full p-4 rounded-full border transition-all flex items-center gap-3 ${
                          calculatorData.features.includes(option)
                            ? "border-[#34C759] bg-[#34C759]/10"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            calculatorData.features.includes(option)
                              ? "border-[#34C759] bg-[#34C759]"
                              : "border-white/40"
                          }`}
                        >
                          {calculatorData.features.includes(option) && <Check size={14} />}
                        </div>
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={() => setCalculatorStep(1)}
                      variant="outline"
                      className="rounded-full border-white/20"
                    >
                      <ChevronLeft size={16} className="mr-2" /> Назад
                    </Button>
                    <Button
                      onClick={() => setCalculatorStep(3)}
                      className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full"
                    >
                      Далее <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {calculatorStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Когда нужен запуск?</h3>
                  <div className="space-y-3 mb-8">
                    {["Срочно (3-5 дней)", "Стандартно (7 дней)", "Не срочно"].map((option) => (
                      <button
                        key={option}
                        onClick={() => setCalculatorData({ ...calculatorData, timeline: option })}
                        className={`w-full p-4 rounded-full border transition-all ${
                          calculatorData.timeline === option
                            ? "border-[#34C759] bg-[#34C759]/10"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {calculatorData.timeline && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 border border-[#34C759]/30 rounded-4xl p-6"
                    >
                      <h4 className="text-xl font-bold mb-4">Рекомендуемый тариф:</h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Тариф:</span>
                          <span className="font-bold">{calculateTotal().plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Разовый платёж:</span>
                          <span className="font-bold">{calculateTotal().setup.toLocaleString()} ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Подписка:</span>
                          <span className="font-bold text-[#34C759]">
                            {calculateTotal().monthly.toLocaleString()} ₽/{billingPeriod === "yearly" ? "год" : "мес"}
                          </span>
                        </div>
                        {calculateTotal().addOns > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Доп. услуги:</span>
                            <span className="font-bold">+{calculateTotal().addOns.toLocaleString()} ₽</span>
                          </div>
                        )}
                        <div className="border-t border-white/20 pt-2 mt-2 flex justify-between text-lg">
                          <span>Первый платёж:</span>
                          <span className="font-bold text-[#34C759]">{calculateTotal().total.toLocaleString()} ₽</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowConsultModal(true)}
                        className="w-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full"
                      >
                        Оставить заявку
                      </Button>
                    </motion.div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={() => setCalculatorStep(2)}
                      variant="outline"
                      className="rounded-full border-white/20"
                    >
                      <ChevronLeft size={16} className="mr-2" /> Назад
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* 6. FAQ */}
        <section className="container mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Вопросы о тарифах</h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  Можно ли сменить тариф после запуска?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  Да, вы можете перейти на другой тариф в любой момент. Апгрейд активируется сразу, даунгрейд — со
                  следующего месяца. Доплата за апгрейд рассчитывается пропорционально оставшимся дням.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">Что входит в Setup Fee?</AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  Разовый платёж покрывает: дизайн и сборку сайта, первичную настройку всех интеграций, SEO-оптимизацию,
                  тестирование и запуск. Это полная стоимость создания сайта, без доплат.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  Что будет, если превышу лимит просмотров?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  Сайт продолжит работать. Мы свяжемся и предложим докупить пакет просмотров (3 000₽ за +20 000) или
                  перейти на старший тариф.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  Есть ли скидка при оплате за год?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  Да, при оплате подписки за год вы получаете скидку 17% — это 2 месяца бесплатно. Setup Fee
                  оплачивается отдельно.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">Можно ли заморозить подписку?</AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  Да, вы можете приостановить подписку на срок до 2 месяцев. Сайт будет недоступен, но все данные
                  сохранятся. Заморозка бесплатная.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">Что если я захочу совсем уйти?</AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  Без проблем и штрафов. Мы предоставим экспорт всех данных (тексты, изображения, контакты заявок). Сайт
                  можно перенести на другой хостинг.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </section>

        {/* 7. CTA */}
        <section className="container mx-auto px-4 py-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-12"
          >
            <h2 className="text-4xl font-bold mb-4">Не можете выбрать?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Расскажите о вашем проекте — поможем подобрать оптимальный тариф
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                onClick={() => setShowConsultModal(true)}
                className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 text-white rounded-full px-8"
                size="lg"
              >
                Получить консультацию
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 hover:border-[#34C759]/50 rounded-full px-8 bg-transparent"
                size="lg"
              >
                <a href="https://t.me/webconveyor" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={20} className="mr-2" />
                  Написать в Telegram
                </a>
              </Button>
            </div>

            <p className="text-sm text-gray-500">Ответим в течение 30 минут в рабочее время</p>
          </motion.div>
        </section>
      </div>

      {/* Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConsultModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-[#1a1a3e] to-[#0f0f23] border border-white/20 rounded-4xl p-8 max-w-md w-full"
          >
            <button
              onClick={() => setShowConsultModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6">Оставить заявку</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:border-[#34C759]/50 focus:outline-none transition-colors"
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:border-[#34C759]/50 focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:border-[#34C759]/50 focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Расскажите о вашем проекте"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-3 focus:border-[#34C759]/50 focus:outline-none transition-colors resize-none"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full"
                size="lg"
              >
                Отправить заявку
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
