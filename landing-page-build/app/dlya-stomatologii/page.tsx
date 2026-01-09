"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Menu, X, Check, ArrowRight, ChevronDown, Phone, MessageCircle } from "lucide-react"

export default function DentalLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clinicName: "",
    name: "",
    phone: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const nichesDropdown = ["Для стоматологий", "Для юристов", "Для салонов красоты", "Для автосервисов"]
  const comparisonsDropdown = ["vs Студии", "vs Фрилансеры", "vs Конструкторы"]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white overflow-x-hidden">
      {/* Animated Background */}
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
            <a
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              WebConveyor
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => smoothScroll("solution")} className="hover:text-[#34C759] transition-colors">
                Решение
              </button>
              <button onClick={() => smoothScroll("pricing")} className="hover:text-[#34C759] transition-colors">
                Тарифы
              </button>
              <button onClick={() => smoothScroll("examples")} className="hover:text-[#34C759] transition-colors">
                Примеры
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
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-[72px] md:hidden bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] z-40 overflow-y-auto"
            >
              <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
                <button
                  onClick={() => smoothScroll("solution")}
                  className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
                >
                  Решение
                </button>
                <button
                  onClick={() => smoothScroll("pricing")}
                  className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
                >
                  Тарифы
                </button>
                <button
                  onClick={() => smoothScroll("examples")}
                  className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
                >
                  Примеры
                </button>
                <a href="/blog" className="text-left text-2xl hover:text-[#34C759] transition-colors py-2">
                  Блог
                </a>

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

      {/* Breadcrumbs */}
      <div className="pt-24 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-[#34C759] transition-colors">
              Главная
            </a>
            <span>→</span>
            <span className="text-white">Для стоматологий</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-8 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-6">
                <span className="text-2xl">🦷</span>
                <span className="text-sm font-semibold">Для стоматологий</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
                Сайт для стоматологии{" "}
                <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                  за 7 дней
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8">
                Современный сайт с записью онлайн, который приводит пациентов. Специально для клиник.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => smoothScroll("cta")}
                  className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/50 transition-all text-lg px-8 text-white rounded-full"
                >
                  Обсудить проект
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => smoothScroll("examples")}
                  className="border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur text-lg rounded-full"
                >
                  Смотреть примеры <ArrowRight className="ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <Check className="text-[#34C759]" size={20} />
                  <span className="text-sm">23 стоматологии уже с нами</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-[#34C759]" size={20} />
                  <span className="text-sm">Среднее +180% заявок</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-[#34C759]" size={20} />
                  <span className="text-sm">Интеграция с YCLIENTS</span>
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
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 shadow-2xl"
              >
                <div className="aspect-video bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 rounded-3xl overflow-hidden">
                  <img
                    src="/dental-clinic-website-mockup.png"
                    alt="Dental Website Mockup"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-3 bg-white/20 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="relative py-8 border-y border-white/10 bg-white/5 backdrop-blur">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-300 mb-4">23 стоматологии уже работают на нашей платформе</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full flex items-center gap-2">
              <span className="text-xl">🦷</span>
              <span className="font-semibold">23 клиники</span>
            </div>
            <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full flex items-center gap-2">
              <span className="text-xl">📈</span>
              <span className="font-semibold">+180% заявок</span>
            </div>
            <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full flex items-center gap-2">
              <span className="text-xl">⏱</span>
              <span className="font-semibold">7 дней запуск</span>
            </div>
            <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="font-semibold">4.9 оценка</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Знакомые проблемы владельцев клиник?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📞",
                title: "Пациенты не записываются",
                items: [
                  "Сайт есть, но заявок мало",
                  "Формы не работают или неудобные",
                  "Нет онлайн-записи",
                  "Пациенты уходят к конкурентам",
                ],
              },
              {
                icon: "😤",
                title: "Сайт устарел",
                items: [
                  "Не адаптирован под мобильные",
                  "Медленно загружается",
                  "Дизайн из 2015 года",
                  "Сложно обновлять информацию",
                ],
              },
              {
                icon: "💸",
                title: "Дорого и долго обновлять",
                items: [
                  "Любое изменение через программиста",
                  "Добавить врача — отдельный счёт",
                  "Обновить цены — ждать неделю",
                  "Нет времени разбираться",
                ],
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-4xl p-6"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <ul className="space-y-2">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Что получает ваша клиника</h2>
            <p className="text-xl text-gray-300">
              Готовый сайт, который работает на привлечение пациентов с первого дня
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🗓",
                title: "Онлайн-запись 24/7",
                description: "Пациенты записываются сами, даже ночью. Интеграция с YCLIENTS или собственная форма.",
              },
              {
                icon: "📱",
                title: "Современный дизайн",
                description: "Адаптивный сайт, быстрая загрузка. Выглядит профессионально на любом устройстве.",
              },
              {
                icon: "✏️",
                title: "Легко обновлять",
                description: "Меняйте цены, добавляйте врачей и акции без программиста. Или мы сделаем это за вас.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-[#34C759]/5 backdrop-blur-xl border border-[#34C759]/20 rounded-4xl p-8 text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className="text-gray-300">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Checklist */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Всё, что нужно сайту клиники</h2>
            <p className="text-xl text-gray-300">Проверенный набор функций, который работает для стоматологий</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 md:p-12 max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  "Страницы услуг (лечение, имплантация, отбеливание, протезирование)",
                  "Раздел «Наши врачи» с фото и регалиями",
                  "Интерактивный прайс-лист",
                  "До/после галерея работ",
                  "Форма записи на приём",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#34C759]/50 transition-all">
                      <Check size={16} className="text-white" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  "Интеграция с YCLIENTS (опционально)",
                  "Акции и спецпредложения",
                  "Отзывы пациентов",
                  "Карта проезда + филиалы",
                  "Часы работы и контакты",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#34C759]/50 transition-all">
                      <Check size={16} className="text-white" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-gray-400 mt-8 pt-8 border-t border-white/10"
            >
              Не нашли нужную функцию?{" "}
              <button
                onClick={() => smoothScroll("cta")}
                className="text-[#34C759] hover:text-[#00C7BE] transition-colors underline font-semibold"
              >
                Обсудим на консультации
              </button>{" "}
              — адаптируем под вашу клинику
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Case Study */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Результаты наших клиентов
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border-2 border-[#34C759]/30 rounded-4xl p-8 md:p-12 max-w-5xl mx-auto shadow-2xl shadow-[#34C759]/10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold mb-2">Стоматология Smile Clinic</h3>
                <p className="text-gray-400 mb-4">Москва, 2 филиала</p>
                <p className="text-gray-300 mb-6">
                  <span className="font-semibold text-white">Задача:</span> Старый сайт на Tilda, мало заявок, нет
                  онлайн-записи
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Было</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-gray-400">заявок/мес</p>
                  </div>
                  <div className="bg-[#34C759]/10 border border-[#34C759]/30 rounded-2xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Стало</p>
                    <p className="text-2xl font-bold">47</p>
                    <p className="text-sm text-gray-400">заявок/мес</p>
                  </div>
                  <div className="bg-[#34C759]/10 border border-[#34C759]/30 rounded-2xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Рост</p>
                    <p className="text-2xl font-bold text-[#34C759]">+292%</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Запуск</p>
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-sm text-gray-400">дней</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl p-2 overflow-hidden">
                <img
                  src="/dental-clinic-website-screenshot.jpg"
                  alt="Smile Clinic Website"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-6 relative">
              <div className="text-6xl text-[#34C759]/20 absolute -top-2 left-4">"</div>
              <p className="text-lg text-gray-200 mb-4 pl-8">
                Главное — не ждали 3 месяца. Реклама запустилась в срок, первые заявки пошли в первый же день. Теперь
                администратор не сидит на телефоне — пациенты сами записываются онлайн.
              </p>
              <p className="text-gray-400 pl-8">
                <span className="font-semibold text-white">Анна Петрова</span>, владелец клиники
              </p>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => smoothScroll("cta")}
                size="lg"
                className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/50 transition-all text-lg px-10 text-white rounded-full"
              >
                Хочу такой же результат <ArrowRight className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section id="examples" className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Примеры сайтов для стоматологий</h2>
            <p className="text-xl text-gray-300">Каждый проект уникален, но построен на проверенной системе</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Стоматология Smile", city: "Москва" },
              { name: "Дентал Плюс", city: "Санкт-Петербург" },
              { name: "Здоровая улыбка", city: "Казань" },
              { name: "Клиника доктора Иванова", city: "Новосибирск" },
            ].map((site, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-4 cursor-pointer group"
              >
                <div className="aspect-video bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 rounded-3xl overflow-hidden mb-4">
                  <img
                    src={`/dental-clinic-.jpg?height=400&width=600&query=dental+clinic+${site.name}+website`}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{site.name}</h3>
                <p className="text-gray-400">{site.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Тарифы для клиник
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "LITE",
                price: "9 900₽",
                monthly: "1 490₽/мес",
                description: "Для небольшой клиники",
                features: ["До 3 страниц", "2 формы записи", "Telegram-уведомления", "Email-поддержка"],
                popular: false,
              },
              {
                name: "STANDARD",
                price: "19 900₽",
                monthly: "2 490₽/мес",
                description: "Оптимально для большинства",
                features: ["До 7 страниц", "Раздел «Врачи»", "Прайс-лист", "YCLIENTS интеграция", "Telegram-поддержка"],
                popular: true,
              },
              {
                name: "PRO",
                price: "34 900₽",
                monthly: "3 990₽/мес",
                description: "Для сети клиник",
                features: ["До 12 страниц", "Несколько филиалов", "До/после галерея", "Приоритетная поддержка"],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-white/5 backdrop-blur-xl border rounded-4xl p-8 ${
                  plan.popular ? "border-[#34C759]/50 shadow-2xl shadow-[#34C759]/20" : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full text-sm font-semibold">
                      ПОПУЛЯРНЫЙ
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                  </div>
                  <p className="text-gray-400">+ {plan.monthly}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="text-[#34C759] flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => smoothScroll("cta")}
                  className={`w-full rounded-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white hover:shadow-xl hover:shadow-[#34C759]/50"
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  Выбрать тариф
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-400 mt-8"
          >
            Все тарифы включают: адаптивный дизайн, SSL, хостинг, SEO-оптимизацию
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Вопросы владельцев клиник
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8"
          >
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-white/10">
                <AccordionTrigger className="text-left hover:text-[#34C759] transition-colors">
                  Нужен ли обязательно раздел с врачами?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Рекомендуем, но не обязательно. Раздел с врачами повышает доверие пациентов на 40%. Мы поможем красиво
                  оформить информацию о специалистах.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-white/10">
                <AccordionTrigger className="text-left hover:text-[#34C759] transition-colors">
                  Можно ли подключить онлайн-запись через YCLIENTS?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Да, интеграция с YCLIENTS входит в тарифы Standard и Pro. Пациенты смогут выбирать врача, услугу и
                  удобное время прямо на сайте.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-white/10">
                <AccordionTrigger className="text-left hover:text-[#34C759] transition-colors">
                  Как добавлять новых врачей или услуги?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  В тарифах с поддержкой — просто напишите нам, добавим за 1-2 часа. Или можете делать это сами через
                  удобную админ-панель.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-white/10">
                <AccordionTrigger className="text-left hover:text-[#34C759] transition-colors">
                  Поможете с текстами для сайта?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Да, у нас есть готовые шаблоны текстов для стоматологий. Также можем написать уникальные тексты за
                  дополнительную плату.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-white/10">
                <AccordionTrigger className="text-left hover:text-[#34C759] transition-colors">
                  Сколько времени займёт перенос с другого сайта?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Обычно 1-2 дня на перенос контента, если он уже готов. Старый сайт продолжит работать, пока новый не
                  будет готов.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-white/10">
                <AccordionTrigger className="text-left hover:text-[#34C759] transition-colors">
                  Что делать, если нужна специфичная функция?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Обсудим на консультации. Большинство функций уже есть в нашей системе. Если нужно что-то особенное —
                  оценим сроки и стоимость.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Form */}
      <section id="cta" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 md:p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Обсудим сайт для вашей клиники?</h2>
            <p className="text-center text-gray-300 mb-8">
              Оставьте заявку — перезвоним в течение 30 минут и ответим на все вопросы
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Заявка отправлена!</h3>
                <p className="text-gray-300">Мы свяжемся с вами в ближайшее время</p>
                <div className="mt-4 text-2xl">🦷</div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Название клиники (необязательно)
                  </label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#34C759] transition-colors"
                    placeholder="Название вашей клиники"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Ваше имя <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#34C759] transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Телефон <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#34C759] transition-colors"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Что важно в новом сайте? (необязательно)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#34C759] transition-colors resize-none"
                    placeholder="Онлайн-запись, раздел врачей, интеграции..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/50 transition-all text-lg text-white rounded-full"
                >
                  Получить консультацию
                </Button>

                <p className="text-center text-sm text-gray-400">Консультация бесплатная и ни к чему не обязывает</p>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span>Telegram</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Phone size={20} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4 bg-white/5 backdrop-blur">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                WebConveyor
              </h3>
              <p className="text-gray-400 text-sm">Сайты с системой заявок за 7 дней</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/#how-it-works" className="hover:text-[#34C759] transition-colors">
                    Как работает
                  </a>
                </li>
                <li>
                  <a href="/#pricing" className="hover:text-[#34C759] transition-colors">
                    Тарифы
                  </a>
                </li>
                <li>
                  <a href="/#cases" className="hover:text-[#34C759] transition-colors">
                    Кейсы
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ниши</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/dlya-stomatologii" className="hover:text-[#34C759] transition-colors font-semibold">
                    Стоматологии
                  </a>
                </li>
                <li>
                  <a href="/niches/юристы" className="hover:text-[#34C759] transition-colors">
                    Юристы
                  </a>
                </li>
                <li>
                  <a href="/niches/салоны" className="hover:text-[#34C759] transition-colors">
                    Салоны красоты
                  </a>
                </li>
                <li>
                  <a href="/niches/автосервисы" className="hover:text-[#34C759] transition-colors">
                    Автосервисы
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#34C759] transition-colors">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#34C759] transition-colors">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@webconveyor.ru" className="hover:text-[#34C759] transition-colors">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 WebConveyor. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
