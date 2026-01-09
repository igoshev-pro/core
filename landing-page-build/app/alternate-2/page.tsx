"use client"

import { useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Play,
  Check,
  X,
  Menu,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Star,
  Phone,
} from "lucide-react"

export default function AlternateTwoPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "3months" | "12months">("monthly")
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  const getPrice = (basePrice: number) => {
    if (billingPeriod === "3months") return Math.round(basePrice * 0.9)
    if (billingPeriod === "12months") return Math.round(basePrice * 0.7)
    return basePrice
  }

  const getDiscount = () => {
    if (billingPeriod === "3months") return 10
    if (billingPeriod === "12months") return 30
    return 0
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Fixed Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent"
            >
              WebConveyor
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-[#34C759] transition-colors font-medium">
                Возможности
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-[#34C759] transition-colors font-medium">
                Тарифы
              </a>
              <a href="#cases" className="text-gray-700 hover:text-[#34C759] transition-colors font-medium">
                Кейсы
              </a>
              <a href="#faq" className="text-gray-700 hover:text-[#34C759] transition-colors font-medium">
                FAQ
              </a>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" className="rounded-full font-semibold">
                Войти
              </Button>
              <Button className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90 font-semibold px-6">
                Начать бесплатно
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-12">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                  WebConveyor
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-gray-900"
                >
                  Возможности
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-gray-900"
                >
                  Тарифы
                </a>
                <a
                  href="#cases"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-gray-900"
                >
                  Кейсы
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-gray-900"
                >
                  FAQ
                </a>
              </nav>

              <div className="mt-12 space-y-3">
                <Button className="w-full rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] h-14 text-lg font-semibold">
                  Позвонить
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#34C759]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00C7BE]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 px-4 py-2 rounded-full mb-6 border border-[#34C759]/20">
              <Sparkles className="w-4 h-4 text-[#34C759]" />
              <span className="text-sm font-semibold text-gray-900">Сайт за 7 дней</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
              Сайт который{" "}
              <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                приносит клиентов
              </span>
              , а не головную боль
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
              Запускайте профессиональный сайт за неделю. Никаких технических знаний, никаких рисков. Только результат.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90 h-14 px-8 text-lg font-semibold w-full sm:w-auto"
              >
                Начать за 0₽
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white h-14 px-8 text-lg font-semibold w-full sm:w-auto bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                Смотреть демо
              </Button>
            </div>
          </motion.div>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <button className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#34C759] ml-1" fill="currentColor" />
                  </div>
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded-full text-white text-sm font-medium">
                2:34
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -left-4 top-1/4 hidden lg:block"
            >
              <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">+340%</div>
                    <div className="text-sm text-gray-600">Конверсия</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -right-4 bottom-1/4 hidden lg:block"
            >
              <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">7 дней</div>
                    <div className="text-sm text-gray-600">До запуска</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-sm text-gray-600 font-medium">Запущенных сайтов</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-2">
                7 дней
              </div>
              <div className="text-sm text-gray-600 font-medium">Средний срок запуска</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-sm text-gray-600 font-medium">Рейтинг клиентов</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-600 font-medium">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Familiar Problems */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-400">Знакомо?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: "💸",
                title: "Переплата за разработку",
                desc: "Студии берут 300-500 тысяч за то, что можно сделать в 10 раз дешевле",
              },
              { icon: "⏰", title: "Месяцы ожидания", desc: "Обещали за месяц, прошло три, а сайта всё нет" },
              { icon: "😤", title: "Каждая правка — деньги", desc: "Хотите изменить текст? Это будет стоить 5000₽" },
              {
                icon: "🤷",
                title: "Непонятная техподдержка",
                desc: "После запуска разработчик пропал, а сайт сломался",
              },
              {
                icon: "📱",
                title: "Сайт не работает на телефонах",
                desc: "Половина клиентов не может нормально открыть ваш сайт",
              },
              { icon: "🐌", title: "Медленная загрузка", desc: "Клиенты уходят, не дождавшись загрузки страницы" },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-6 hover:border-pink-300 transition-colors"
              >
                <div className="text-4xl mb-3">{problem.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600">{problem.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="features" className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#34C759]/10 px-4 py-2 rounded-full mb-6 border border-[#34C759]/20">
              <Zap className="w-4 h-4 text-[#34C759]" />
              <span className="text-sm font-semibold text-gray-900">Наше решение</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              WebConveyor решает{" "}
              <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                все эти проблемы
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Запуск за 7 дней",
                desc: "Не месяцы ожидания, а быстрый результат. Вы получаете готовый сайт через неделю.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Shield,
                title: "Фиксированная цена",
                desc: "Никаких скрытых платежей. Вы знаете точную стоимость с первого дня.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Бесплатные правки",
                desc: "Меняйте контент сколько угодно без дополнительных платежей.",
                color: "from-[#34C759] to-[#00C7BE]",
              },
              {
                icon: Users,
                title: "24/7 поддержка",
                desc: "Мы всегда на связи. Техническая поддержка включена в подписку.",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl -z-10"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                />
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 group-hover:border-gray-200">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Прозрачные{" "}
              <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">тарифы</span>
            </h2>
            <p className="text-lg text-gray-600">Без скрытых платежей и сюрпризов</p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  billingPeriod === "monthly" ? "bg-white text-gray-900 shadow-lg" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Помесячно
              </button>
              <button
                onClick={() => setBillingPeriod("3months")}
                className={`px-6 py-3 rounded-full font-semibold transition-all relative ${
                  billingPeriod === "3months" ? "bg-white text-gray-900 shadow-lg" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                3 месяца
                <span className="absolute -top-2 -right-2 bg-[#34C759] text-white text-xs px-2 py-0.5 rounded-full">
                  -10%
                </span>
              </button>
              <button
                onClick={() => setBillingPeriod("12months")}
                className={`px-6 py-3 rounded-full font-semibold transition-all relative ${
                  billingPeriod === "12months"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                12 месяцев
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white text-xs px-2 py-0.5 rounded-full">
                  -30%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Lite",
                setup: 9900,
                monthly: 1490,
                features: [
                  "5 страниц",
                  "Адаптивный дизайн",
                  "Базовая СЕО-оптимизация",
                  "Форма обратной связи",
                  "Техподдержка 9-18",
                ],
                popular: false,
              },
              {
                name: "Standard",
                setup: 19900,
                monthly: 2490,
                features: [
                  "10 страниц",
                  "Премиум дизайн",
                  "Продвинутая СЕО",
                  "Интеграция с CRM",
                  "Аналитика и метрики",
                  "Техподдержка 24/7",
                ],
                popular: true,
              },
              {
                name: "Pro",
                setup: 34900,
                monthly: 3990,
                features: [
                  "Безлимит страниц",
                  "Уникальный дизайн",
                  "Максимальная СЕО",
                  "Полная интеграция",
                  "Приоритетная поддержка",
                  "Личный менеджер",
                  "Обучение команды",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl scale-105 border-4 border-[#34C759]"
                    : "bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white px-6 py-2 rounded-full font-semibold text-sm">
                    Популярный
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    {getDiscount() > 0 && (
                      <span className={`text-2xl line-through ${plan.popular ? "text-gray-400" : "text-gray-400"}`}>
                        {plan.setup.toLocaleString()}₽
                      </span>
                    )}
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      {getPrice(plan.setup).toLocaleString()}₽
                    </span>
                  </div>
                  <div className={`text-sm mt-1 ${plan.popular ? "text-gray-300" : "text-gray-600"}`}>
                    Стоимость запуска
                  </div>
                  <div className={`mt-4 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    <span className="text-2xl font-bold">{getPrice(plan.monthly).toLocaleString()}₽</span>
                    <span className={`text-sm ${plan.popular ? "text-gray-300" : "text-gray-600"}`}>/мес</span>
                  </div>
                </div>

                <Button
                  className={`w-full rounded-full h-12 font-semibold mb-8 ${
                    plan.popular
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white hover:opacity-90"
                  }`}
                >
                  Выбрать {plan.name}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? "text-[#34C759]" : "text-[#34C759]"}`}
                      />
                      <span className={`text-sm ${plan.popular ? "text-gray-200" : "text-gray-600"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 sm:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Наши{" "}
              <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                гарантии
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: "30 дней гарантии", desc: "Не понравится — вернём деньги" },
              { icon: Clock, title: "Запуск за 7 дней", desc: "Или компенсируем задержку" },
              { icon: Zap, title: "Техподдержка 24/7", desc: "Всегда на связи" },
              { icon: Star, title: "Бесплатные правки", desc: "Меняйте контент без ограничений" },
            ].map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <guarantee.icon className="w-10 h-10 text-[#34C759] mb-4" />
                <h3 className="text-lg font-bold mb-2">{guarantee.title}</h3>
                <p className="text-gray-400 text-sm">{guarantee.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Частые{" "}
              <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                вопросы
              </span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "Что входит в стоимость запуска?",
                  a: "Полная разработка сайта, уникальный дизайн, адаптация под мобильные, базовая СЕО-оптимизация, настройка аналитики и форм обратной связи.",
                },
                {
                  q: "Могу ли я самостоятельно редактировать сайт?",
                  a: "Да! Вы получаете простую панель управления, где можете менять тексты, фото, добавлять страницы без технических знаний.",
                },
                {
                  q: "Что такое ежемесячная подписка?",
                  a: "Это плата за хостинг, техническую поддержку, обновления безопасности и возможность вносить изменения в сайт.",
                },
                {
                  q: "Можно ли отменить подписку?",
                  a: "Да, вы можете отменить в любой момент. Сайт останется у вас, но без поддержки и хостинга.",
                },
                {
                  q: "Сколько времени занимает запуск?",
                  a: "В среднем 7 дней от согласования ТЗ до готового сайта. Сложные проекты могут занять до 14 дней.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border-2 border-gray-200 rounded-2xl px-6 hover:border-[#34C759]/50 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#34C759] to-[#00C7BE]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Готовы запустить свой сайт?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Начните сегодня и получите профессиональный сайт через 7 дней
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-full h-14 px-8 text-lg font-semibold w-full sm:w-auto"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 rounded-full h-14 px-8 text-lg font-semibold w-full sm:w-auto bg-transparent"
            >
              <Phone className="w-5 h-5 mr-2" />
              Позвонить нам
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-4">
              WebConveyor
            </div>
            <p className="text-gray-400">© 2026 Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
