"use client"

import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Menu, X, Check, ArrowRight, Play, ChevronDown } from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<"monthly" | "3months" | "12months">("monthly")
  const { scrollYProgress } = useScroll()

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

  const nichesDropdown = ["Для стоматологий", "Для юристов", "Для салонов красоты", "Для автосервисов"]

  const comparisonsDropdown = ["vs Студии", "vs Фрилансеры", "vs Конструкторы"]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white overflow-x-hidden">
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/5 backdrop-blur-xl border-b border-white/10 py-3" : "py-4"
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
              <button onClick={() => smoothScroll("how-it-works")} className="hover:text-[#34C759] transition-colors">
                Как работает
              </button>
              <button onClick={() => smoothScroll("pricing")} className="hover:text-[#34C759] transition-colors">
                Тарифы
              </button>
              <button onClick={() => smoothScroll("cases")} className="hover:text-[#34C759] transition-colors">
                Кейсы
              </button>
              <a href="/blog" className="hover:text-[#34C759] transition-colors">
                Блог
              </a>

              {/* Ниши Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "niches" ? null : "niches")}
                  className="flex items-center gap-1 hover:text-[#34C759] transition-colors"
                >
                  Ниши <ChevronDown size={16} />
                </button>
                {openDropdown === "niches" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 min-w-[200px] shadow-xl"
                  >
                    {nichesDropdown.map((item, index) => (
                      <a
                        key={index}
                        href={`/niches/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 hover:bg-white/10 rounded-xl transition-colors"
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
                  className="flex items-center gap-1 hover:text-[#34C759] transition-colors"
                >
                  Сравнения <ChevronDown size={16} />
                </button>
                {openDropdown === "comparisons" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 min-w-[200px] shadow-xl"
                  >
                    {comparisonsDropdown.map((item, index) => (
                      <a
                        key={index}
                        href={`/comparisons/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 hover:bg-white/10 rounded-xl transition-colors"
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
              className="hidden md:inline-flex bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 transition-all text-white rounded-full"
            >
              Оставить заявку
            </Button>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Fullscreen Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-[72px] md:hidden bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] z-40 overflow-y-auto"
            >
              <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
                <button
                  onClick={() => smoothScroll("how-it-works")}
                  className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
                >
                  Как работает
                </button>
                <button
                  onClick={() => smoothScroll("pricing")}
                  className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
                >
                  Тарифы
                </button>
                <button
                  onClick={() => smoothScroll("cases")}
                  className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
                >
                  Кейсы
                </button>
                <a href="/blog" className="text-left text-2xl hover:text-[#34C759] transition-colors py-2">
                  Блог
                </a>

                {/* Mobile Ниши */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm text-gray-400 mb-3">Ниши</p>
                  {nichesDropdown.map((item, index) => (
                    <a
                      key={index}
                      href={`/niches/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-lg py-2 hover:text-[#34C759] transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>

                {/* Mobile Сравнения */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm text-gray-400 mb-3">Сравнения</p>
                  {comparisonsDropdown.map((item, index) => (
                    <a
                      key={index}
                      href={`/comparisons/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-lg py-2 hover:text-[#34C759] transition-colors"
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
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
                Сайт с системой заявок{" "}
                <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                  за 7 дней
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8">Фиксированная цена • Без сюрпризов • С поддержкой</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => smoothScroll("cta")}
                  className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/50 transition-all text-lg px-8 text-white rounded-full"
                >
                  Получить предложение
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur text-lg rounded-full"
                >
                  Смотреть демо <ArrowRight className="ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Check className="text-[#34C759]" size={20} />
                  <span className="text-sm">150+ запущенных сайтов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-[#34C759]" size={20} />
                  <span className="text-sm">87% клиентов остаются {">"} 1 года</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-[#34C759]" size={20} />
                  <span className="text-sm">Средний рост заявок: +180%</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-4 shadow-2xl"
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 rounded-3xl overflow-hidden group cursor-pointer">
                  {/* Video Thumbnail/Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 flex items-center justify-center">
                    {/* Play Button */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative w-20 h-20 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-10 h-10 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                  {/* Video Duration Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-sm">
                    2:34
                  </div>
                </div>
                <div className="mt-4 space-y-2 px-2">
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="relative py-8 border-y border-white/10 bg-white/5 backdrop-blur">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-300 mb-4">Нам доверяют клиники, юридические компании и салоны красоты</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full">
              <span className="font-semibold">150+ сайтов</span>
            </div>
            <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full">
              <span className="font-semibold">7 дней запуск</span>
            </div>
            <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full">
              <span className="font-semibold">98% довольны</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Специализируемся на нишах
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {[
              {
                title: "Стоматологии",
                count: "23 сайта",
                niche: "стоматологии",
              },
              {
                title: "Юристы",
                count: "18 сайтов",
                niche: "юристы",
              },
              {
                title: "Салоны красоты",
                count: "15 сайтов",
                niche: "салоны",
              },
              {
                title: "Автосервисы",
                count: "12 сайтов",
                niche: "автосервисы",
              },
              {
                title: "Ремонт",
                count: "9 сайтов",
                niche: "ремонт",
              },
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 text-center cursor-pointer group"
                onClick={() => {
                  console.log("[v0] industry_click", industry.niche)
                }}
              >
                <h3 className="text-xl font-bold mb-2">{industry.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{industry.count}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#34C759]/30 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 hover:from-[#34C759]/20 hover:to-[#00C7BE]/20 hover:border-[#34C759]/50 backdrop-blur text-white rounded-full w-full group-hover:shadow-lg group-hover:shadow-[#34C759]/30 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = `/niches/${industry.niche}`
                  }}
                >
                  Пример
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-300 text-lg"
          >
            Не нашли свою нишу?{" "}
            <button
              onClick={() => smoothScroll("cta")}
              className="text-[#34C759] hover:text-[#00C7BE] transition-colors underline font-semibold"
            >
              Напишите — обсудим
            </button>
          </motion.p>
        </div>
      </section>

      {/* Problem Section */}
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
            {[
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
            ].map((card, index) => (
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

      {/* Solution Section */}
      <section className="relative py-20 px-4 bg-white/5">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-6"
          >
            Есть другой путь
          </motion.h2>

          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
            Мы не студия. Не фрилансер. Не конструктор. Мы — система, которая запускает сайты за 7 дней.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: "⚡", title: "Быстро", description: "7 дней, не месяцы" },
              { icon: "💰", title: "Честно", description: "Фиксированная цена без доплат" },
              { icon: "🛡️", title: "Надёжно", description: "Поддержка включена навсегда" },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-[#34C759]/5 to-[#00C7BE]/5 backdrop-blur-xl border border-[#34C759]/20 rounded-4xl p-8 text-center"
              >
                <div className="text-5xl mb-4 filter drop-shadow-[0_0_20px_rgba(52,199,89,0.5)]">{card.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-300">{card.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 backdrop-blur-xl border border-white/10 rounded-4xl p-6"
          >
            <p className="text-lg italic text-gray-200">
              "Как IKEA для сайтов: готовые модули, быстрая сборка, гарантированный результат."
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Как это работает
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#34C759]/50 via-[#00C7BE]/50 to-[#34C759]/50" />

            {[
              { day: "День 1", icon: "📋", title: "Бриф", description: "30-минутный звонок" },
              { day: "День 2-4", icon: "🔨", title: "Сборка", description: "Создаём ваш сайт" },
              { day: "День 5-6", icon: "✏️", title: "Ревью", description: "1 раунд правок" },
              { day: "День 7", icon: "🚀", title: "Запуск", description: "Сайт в работе" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 text-center z-10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#34C759] to-[#00C7BE] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {step.icon}
                </div>
                <div className="text-sm text-[#34C759] mb-2">{step.day}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-300 mb-6">Что нужно от вас: логотип, тексты, фото — или закажите у нас</p>
            <Button
              onClick={() => smoothScroll("cta")}
              className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 rounded-full"
            >
              Начать <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
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
                  <th className="text-center py-4 px-4 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 border border-[#34C759]/30 rounded-t-4xl">
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
                  <td className="text-center py-4 px-4 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 border-x border-b border-[#34C759]/30 rounded-b-4xl">
                    <span className="text-[#34C759] font-bold">✓ Возврат</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
            {[
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
            ].map((plan, index) => {
              const monthlyPrice = plan.monthly
              const threeMonthsPrice = Math.round(monthlyPrice * 3 * 0.9) // 10% discount
              const twelveMonthsPrice = Math.round(monthlyPrice * 12 * 0.7) // 30% discount

              let displayPrice = `${monthlyPrice}₽/мес`
              let originalPrice = null

              if (subscriptionPeriod === "3months") {
                displayPrice = `${threeMonthsPrice}₽`
                originalPrice = `${monthlyPrice * 3}₽`
              } else if (subscriptionPeriod === "12months") {
                displayPrice = `${twelveMonthsPrice}₽`
                originalPrice = `${monthlyPrice * 12}₽`
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
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 bg-white/5">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Специализируемся на нишах
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {[
              {
                title: "Стоматологии",
                count: "23 сайта",
                niche: "стоматологии",
              },
              {
                title: "Юристы",
                count: "18 сайтов",
                niche: "юристы",
              },
              {
                title: "Салоны красоты",
                count: "15 сайтов",
                niche: "салоны",
              },
              {
                title: "Автосервисы",
                count: "12 сайтов",
                niche: "автосервисы",
              },
              {
                title: "Ремонт",
                count: "9 сайтов",
                niche: "ремонт",
              },
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 text-center cursor-pointer group"
                onClick={() => {
                  console.log("[v0] industry_click", industry.niche)
                }}
              >
                <h3 className="text-xl font-bold mb-2">{industry.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{industry.count}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#34C759]/30 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 hover:from-[#34C759]/20 hover:to-[#00C7BE]/20 hover:border-[#34C759]/50 backdrop-blur text-white rounded-full w-full group-hover:shadow-lg group-hover:shadow-[#34C759]/30 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = `/niches/${industry.niche}`
                  }}
                >
                  Пример
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-300 text-lg"
          >
            Не нашли свою нишу?{" "}
            <button
              onClick={() => smoothScroll("cta")}
              className="text-[#34C759] hover:text-[#00C7BE] transition-colors underline font-semibold"
            >
              Напишите — обсудим
            </button>
          </motion.p>
        </div>
      </section>

      {/* Case Studies */}
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
            {[
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
            ].map((caseStudy, index) => (
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

      {/* Guarantees */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Гарантии без звёздочек
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "🗓",
                title: "7 дней",
                description: "Запуск за 7 рабочих дней или возврат 100% оплаты",
              },
              {
                icon: "💵",
                title: "Фикс. цена",
                description: "Цена в договоре = цена в счёте. Никаких доплат",
              },
              {
                icon: "🔄",
                title: "Возврат денег",
                description: "Если за 30 дней нет заявок при наличии трафика — возврат",
              },
            ].map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-[#34C759]/5 to-[#00C7BE]/5 backdrop-blur-xl border border-[#34C759]/20 rounded-4xl p-8 text-center"
              >
                <div className="text-5xl mb-4 filter drop-shadow-[0_0_20px_rgba(52,199,89,0.5)]">{guarantee.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-[#34C759]">{guarantee.title}</h3>
                <p className="text-gray-300">{guarantee.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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
            {[
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
            ].map((faq, index) => (
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

      {/* Final CTA */}
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

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10 bg-white/5 backdrop-blur">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-4">
                WebConveyor
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => smoothScroll("pricing")}
                    className="text-gray-400 hover:text-[#34C759] transition-colors"
                  >
                    Тарифы
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => smoothScroll("how-it-works")}
                    className="text-gray-400 hover:text-[#34C759] transition-colors"
                  >
                    Как работает
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => smoothScroll("cases")}
                    className="text-gray-400 hover:text-[#34C759] transition-colors"
                  >
                    Кейсы
                  </button>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ниши</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                    Стоматологии
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                    Юристы
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                    Салоны красоты
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                    Автосервисы
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">+7 (XXX) XXX-XX-XX</li>
                <li className="text-gray-400">email@domain.ru</li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            <p>© 2026 WebConveyor. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
