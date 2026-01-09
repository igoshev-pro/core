"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Menu, X, Check, ArrowRight, Play, ChevronDown, Zap, Clock, Shield, Star } from "lucide-react"

export default function AlternateLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<"monthly" | "3months" | "12months">("monthly")
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const smoothScroll = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const calculatePrice = (basePrice: number, period: typeof subscriptionPeriod) => {
    if (period === "3months") return Math.round(basePrice * 0.9)
    if (period === "12months") return Math.round(basePrice * 0.7)
    return basePrice
  }

  const nichesDropdown = ["Для стоматологий", "Для юристов", "Для салонов красоты", "Для автосервисов"]
  const comparisonsDropdown = ["vs Студии", "vs Фрилансеры", "vs Конструкторы"]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#34C759]/5 text-gray-900 overflow-x-hidden">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#34C759]/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#00C7BE]/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              WebConveyor
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => smoothScroll("how-it-works")}
                className="text-gray-700 hover:text-[#34C759] transition-colors"
              >
                Как работает
              </button>
              <button
                onClick={() => smoothScroll("pricing")}
                className="text-gray-700 hover:text-[#34C759] transition-colors"
              >
                Тарифы
              </button>
              <button
                onClick={() => smoothScroll("cases")}
                className="text-gray-700 hover:text-[#34C759] transition-colors"
              >
                Кейсы
              </button>
              <a href="/blog" className="text-gray-700 hover:text-[#34C759] transition-colors">
                Блог
              </a>

              {/* Ниши Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "niches" ? null : "niches")}
                  className="flex items-center gap-1 text-gray-700 hover:text-[#34C759] transition-colors"
                >
                  Ниши <ChevronDown size={16} />
                </button>
                {openDropdown === "niches" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 bg-white border border-gray-200 rounded-2xl p-2 min-w-[200px] shadow-xl"
                  >
                    {nichesDropdown.map((item, index) => (
                      <a
                        key={index}
                        href={`/niches/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
                      >
                        {item}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Сравнения Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "comparisons" ? null : "comparisons")}
                  className="flex items-center gap-1 text-gray-700 hover:text-[#34C759] transition-colors"
                >
                  Сравнения <ChevronDown size={16} />
                </button>
                {openDropdown === "comparisons" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 bg-white border border-gray-200 rounded-2xl p-2 min-w-[200px] shadow-xl"
                  >
                    {comparisonsDropdown.map((item, index) => (
                      <a
                        key={index}
                        href={`/comparisons/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
                      >
                        {item}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            </nav>

            <Button
              onClick={() => smoothScroll("cta")}
              className="hidden md:inline-flex bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/30 transition-all text-white rounded-full px-6"
            >
              Оставить заявку
            </Button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-[72px] md:hidden bg-white z-40 overflow-y-auto"
            >
              <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
                <button
                  onClick={() => smoothScroll("how-it-works")}
                  className="text-left text-2xl text-gray-800 hover:text-[#34C759] transition-colors py-2"
                >
                  Как работает
                </button>
                <button
                  onClick={() => smoothScroll("pricing")}
                  className="text-left text-2xl text-gray-800 hover:text-[#34C759] transition-colors py-2"
                >
                  Тарифы
                </button>
                <button
                  onClick={() => smoothScroll("cases")}
                  className="text-left text-2xl text-gray-800 hover:text-[#34C759] transition-colors py-2"
                >
                  Кейсы
                </button>
                <a
                  href="/blog"
                  className="text-left text-2xl text-gray-800 hover:text-[#34C759] transition-colors py-2"
                >
                  Блог
                </a>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-500 mb-3">Ниши</p>
                  {nichesDropdown.map((item, index) => (
                    <a
                      key={index}
                      href={`/niches/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-lg py-2 text-gray-700 hover:text-[#34C759] transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-500 mb-3">Сравнения</p>
                  {comparisonsDropdown.map((item, index) => (
                    <a
                      key={index}
                      href={`/comparisons/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-lg py-2 text-gray-700 hover:text-[#34C759] transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>

                <Button
                  onClick={() => smoothScroll("cta")}
                  size="lg"
                  className="mt-6 bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white rounded-full text-lg"
                >
                  Позвонить
                </Button>
              </nav>
            </motion.div>
          </>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#34C759]/20 rounded-full text-sm mb-8 shadow-sm"
              >
                <span className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse" />
                <span className="text-gray-600">Запустили уже 150+ проектов</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight">
                Сайт с системой заявок{" "}
                <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                  за 7 дней
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto text-balance">
                Фиксированная цена • Без сюрпризов • С поддержкой
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  onClick={() => smoothScroll("cta")}
                  className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/30 transition-all text-lg px-8 text-white rounded-full"
                >
                  Получить предложение
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 text-lg rounded-full px-8"
                >
                  Смотреть демо <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-gray-700"
                >
                  <Check className="text-[#34C759]" size={24} strokeWidth={3} />
                  <span className="text-sm md:text-base">150+ запущенных сайтов</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 text-gray-700"
                >
                  <Check className="text-[#34C759]" size={24} strokeWidth={3} />
                  <span className="text-sm md:text-base">87% клиентов {">"}1 года</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2 text-gray-700"
                >
                  <Check className="text-[#34C759]" size={24} strokeWidth={3} />
                  <span className="text-sm md:text-base">Рост заявок: +180%</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative max-w-5xl mx-auto"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-[#34C759]/20 to-[#00C7BE]/20 rounded-[3rem] blur-2xl" />
                <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="relative aspect-video bg-gradient-to-br from-[#34C759]/5 to-[#00C7BE]/5 rounded-[2rem] overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl"
                        >
                          <Play className="w-10 h-10 text-[#34C759] ml-1" fill="currentColor" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur rounded-full text-sm text-gray-900 font-medium shadow">
                      2:34
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-16 px-4 border-y border-gray-200 bg-white/50 backdrop-blur">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: "150+", label: "Запущенных сайтов" },
              { value: "87%", label: "Остаются >1 года" },
              { value: "+180%", label: "Средний рост заявок" },
              { value: "7 дней", label: "До запуска" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Знакомо Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Знакомо?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Распространенные проблемы при создании сайта</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "💸", text: "«Сначала 50 тыс., потом еще 30, и еще...»", color: "from-red-500 to-pink-500" },
              { emoji: "⏰", text: "«Обещали за месяц, сдали через три»", color: "from-orange-500 to-yellow-500" },
              { emoji: "🎨", text: "«Дизайн круто, но заявок ноль»", color: "from-purple-500 to-pink-500" },
              { emoji: "🐛", text: "«Сайт лежит, админ пропал»", color: "from-blue-500 to-cyan-500" },
              { emoji: "📞", text: "«Нашли ошибку? Ждите 2 недели»", color: "from-green-500 to-teal-500" },
              {
                emoji: "🔒",
                text: "«Хотим изменить - платите за каждую правку»",
                color: "from-indigo-500 to-purple-500",
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-3xl blur transition-opacity duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
                <div className="relative bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                  <div
                    className={`inline-flex px-3 py-1.5 rounded-full bg-gradient-to-r ${problem.color} text-white text-sm font-medium mb-4`}
                  >
                    {problem.emoji}
                  </div>
                  <p className="text-gray-700 text-lg">{problem.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="py-32 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Наш подход —{" "}
              <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                продуктовый конвейер
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы не делаем уникальные сайты с нуля. Мы адаптируем проверенные решения под вашу нишу
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "7 дней до запуска",
                description: "Не месяцы разработки, а четкий процесс с фиксированными сроками",
                gradient: "from-[#34C759] to-[#00C7BE]",
              },
              {
                icon: Shield,
                title: "Фиксированная цена",
                description: "Вы платите один раз за setup и фиксированную подписку. Без скрытых платежей",
                gradient: "from-[#00C7BE] to-[#0099FF]",
              },
              {
                icon: Zap,
                title: "Быстрая поддержка",
                description: "Исправления в течение 24 часов, техподдержка в рабочее время",
                gradient: "from-[#34C759] to-[#00E5A0]",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Все необходимое из коробки</h2>
            <p className="text-xl text-gray-600">Не нужно доплачивать за базовые функции</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Современный адаптивный дизайн",
              "Форма захвата заявок",
              "Интеграция с CRM (AmoCRM, Bitrix24)",
              "Онлайн-чат с клиентами",
              "Блог для SEO",
              "Аналитика и счетчики",
              "SSL-сертификат",
              "Хостинг и домен",
              "Google Maps интеграция",
              "Галерея работ/услуг",
              "Калькулятор стоимости",
              "Всплывающие формы",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Check className="text-white" size={20} strokeWidth={3} />
                </div>
                <span className="text-lg text-gray-800">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Прозрачные тарифы</h2>
            <p className="text-xl text-gray-600 mb-12">Выберите период подписки и сэкономьте</p>

            {/* Subscription Period Toggle */}
            <div className="inline-flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-full shadow-sm">
              {[
                { value: "monthly", label: "Помесячно" },
                { value: "3months", label: "3 месяца -10%" },
                { value: "12months", label: "12 месяцев -30%" },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSubscriptionPeriod(period.value as typeof subscriptionPeriod)}
                  className={`px-6 py-3 rounded-full transition-all text-sm font-medium ${
                    subscriptionPeriod === period.value
                      ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "LITE",
                subtitle: "Для старта",
                setup: 9900,
                monthly: 1490,
                features: [
                  "До 5 страниц",
                  "Форма заявок",
                  "Базовая аналитика",
                  "Мобильная версия",
                  "Техподдержка в рабочее время",
                  "SSL-сертификат",
                ],
                popular: false,
              },
              {
                name: "STANDARD",
                subtitle: "Оптимальный",
                setup: 19900,
                monthly: 2490,
                features: [
                  "До 15 страниц",
                  "Форма заявок + онлайн-чат",
                  "Интеграция с CRM",
                  "Продвинутая аналитика",
                  "Блог для SEO",
                  "Приоритетная поддержка",
                  "Калькулятор стоимости",
                  "Всплывающие формы",
                ],
                popular: true,
              },
              {
                name: "PRO",
                subtitle: "Максимум",
                setup: 34900,
                monthly: 3990,
                features: [
                  "Неограниченно страниц",
                  "Все из Standard +",
                  "Личный менеджер",
                  "Поддержка 24/7",
                  "A/B тестирование",
                  "Кастомные доработки",
                  "Приоритет в очереди",
                  "Ежемесячная оптимизация",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? "md:-mt-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white text-sm font-medium rounded-full shadow-lg">
                      Популярный
                    </div>
                  </div>
                )}
                <div
                  className={`relative bg-white border-2 rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-300 h-full ${
                    plan.popular ? "border-[#34C759] shadow-xl" : "border-gray-200"
                  }`}
                >
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.subtitle}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">
                        {calculatePrice(plan.setup, subscriptionPeriod).toLocaleString("ru")}₽
                      </span>
                      {subscriptionPeriod !== "monthly" && (
                        <span className="text-xl text-gray-400 line-through">{plan.setup.toLocaleString("ru")}₽</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Единоразовый Setup</p>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {calculatePrice(plan.monthly, subscriptionPeriod).toLocaleString("ru")}₽
                      </span>
                      {subscriptionPeriod !== "monthly" && (
                        <span className="text-lg text-gray-400 line-through">{plan.monthly.toLocaleString("ru")}₽</span>
                      )}
                      <span className="text-gray-600">/мес</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => smoothScroll("cta")}
                    className={`w-full mb-8 rounded-full text-lg ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white hover:shadow-lg"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Выбрать {plan.name}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-3">
                        <Check className="text-[#34C759] flex-shrink-0 mt-0.5" size={20} strokeWidth={3} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Специализируемся на нишах</h2>
            <p className="text-xl text-gray-600">Готовые решения для разных индустрий</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Стоматологии", count: 43 },
              { name: "Юристы", count: 28 },
              { name: "Салоны красоты", count: 35 },
              { name: "Автосервисы", count: 22 },
              { name: "Ремонт и строительство", count: 31 },
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all group"
              >
                <h3 className="text-2xl font-bold mb-2">{industry.name}</h3>
                <p className="text-gray-600 mb-6">{industry.count} сайтов запущено</p>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-2 group-hover:bg-gradient-to-r group-hover:from-[#34C759] group-hover:to-[#00C7BE] group-hover:text-white group-hover:border-transparent transition-all bg-transparent"
                >
                  Пример
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-[3rem] p-12 md:p-16 text-center shadow-xl"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] flex items-center justify-center mx-auto mb-8">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Гарантия результата</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Если в течение первых 30 дней вы не получите ни одной заявки с сайта — мы вернем деньги за Setup. Без
              вопросов.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#34C759]/10 rounded-full">
              <Star className="text-[#34C759]" size={20} fill="currentColor" />
              <span className="text-gray-800 font-medium">100% гарантия возврата</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Частые вопросы</h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Почему подписка? Почему не могу купить сайт насовсем?",
                a: "Подписка включает хостинг, домен, техподдержку, обновления и исправления. Это выгоднее, чем платить отдельно за каждую услугу.",
              },
              {
                q: "Что входит в техподдержку?",
                a: "Исправление ошибок, обновление контента, консультации, мелкие правки дизайна, помощь с настройкой интеграций.",
              },
              {
                q: "Можно ли отменить подписку?",
                a: "Да, в любой момент. Без штрафов и скрытых комиссий. После отмены сайт работает до конца оплаченного периода.",
              },
              {
                q: "Сколько времени занимает запуск?",
                a: "От 7 до 14 дней в зависимости от тарифа и сложности. Мы даем четкий таймлайн еще на этапе обсуждения.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white border border-gray-200 rounded-2xl px-6 data-[state=open]:shadow-lg transition-all"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#34C759] py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-[3rem] p-12 md:p-16 shadow-2xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Готовы начать?</h2>
              <p className="text-xl text-gray-600">Оставьте контакт — обсудим детали и ответим на вопросы</p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:border-transparent transition-all"
                  placeholder="Как вас зовут?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                <input
                  type="tel"
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:border-transparent transition-all"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (необязательно)</label>
                <input
                  type="email"
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/30 transition-all text-white text-lg py-6 rounded-2xl"
              >
                Получить подробное предложение
              </Button>

              <p className="text-center text-sm text-gray-500">Перезвоним в течение 30 минут в рабочее время</p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gray-200 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-4">
                WebConveyor
              </div>
              <p className="text-gray-600 text-sm">Продуктовый конвейер для быстрого запуска сайтов</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Продукт</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#34C759] transition-colors">
                    Как работает
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#34C759] transition-colors">
                    Тарифы
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#34C759] transition-colors">
                    Кейсы
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Ниши</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#34C759] transition-colors">
                    Стоматологии
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#34C759] transition-colors">
                    Юристы
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#34C759] transition-colors">
                    Салоны красоты
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">+7 (999) 123-45-67</li>
                <li className="text-gray-600">hello@webconveyor.ru</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2026 WebConveyor. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#34C759] transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-[#34C759] transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
