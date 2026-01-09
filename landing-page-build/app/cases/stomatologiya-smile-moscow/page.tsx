"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Target,
  Zap,
  FileText,
  Settings,
  TestTube,
  Rocket,
  ArrowRight,
  X,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"

// Counter component for animated numbers
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function CaseStudyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const screenshots = [
    { title: "Главная страница", image: "/dental-clinic-website-homepage-hero.jpg" },
    { title: "Страница услуги Имплантация", image: "/dental-implants-service-page.jpg" },
    { title: "Раздел Наши врачи", image: "/dental-team-doctors-page.jpg" },
    { title: "Прайс-лист", image: "/dental-services-price-list.jpg" },
    { title: "Форма онлайн-записи", image: "/online-booking-form-dental.jpg" },
    { title: "Мобильная версия", image: "/dental-website-mobile-version.jpg" },
  ]

  const relatedCases = [
    {
      title: "Дентал Плюс",
      subtitle: "Стоматология, СПб",
      metric: "+245% заявок",
      image: "/dental-clinic-website.jpg",
    },
    {
      title: "Клиника Здоровье",
      subtitle: "Медицинский центр, Казань",
      metric: "+180% заявок",
      image: "/medical-clinic-website.png",
    },
    {
      title: "Салон красоты Миа",
      subtitle: "Бьюти, Москва",
      metric: "+312% заявок",
      image: "/beauty-salon-website.png",
    },
  ]

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsFormSubmitted(true)
    setTimeout(() => setIsFormSubmitted(false), 3000)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#34C759]/20 via-[#00C7BE]/20 to-[#34C759]/10 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Как Smile Clinic увеличили заявки на 292%",
            author: {
              "@type": "Organization",
              name: "WebConveyor",
            },
            publisher: {
              "@type": "Organization",
              name: "WebConveyor",
            },
            about: {
              "@type": "Organization",
              name: "Smile Clinic",
              description: "Стоматологическая клиника, Москва",
            },
            review: {
              "@type": "Review",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
              },
              author: {
                "@type": "Person",
                name: "Анна Петрова",
              },
            },
          }),
        }}
      />

      {/* SECTION 1: HERO */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-white/60 mb-8"
          >
            <Link href="/" className="hover:text-[#34C759] transition-colors">
              Главная
            </Link>
            <ChevronRight size={16} />
            <Link href="/cases" className="hover:text-[#34C759] transition-colors">
              Кейсы
            </Link>
            <ChevronRight size={16} />
            <span className="text-white">Стоматология Smile Clinic</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-6">
                <span className="text-2xl">🦷</span>
                <span className="text-sm">Стоматология</span>
              </div>

              {/* H1 */}
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
                Как Smile Clinic увеличили заявки на{" "}
                <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">292%</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/70 mb-8">Стоматологическая клиника, Москва • 2 филиала</p>

              {/* Key Result Highlight */}
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#34C759]/20 to-[#00C7BE]/20 backdrop-blur-xl border border-[#34C759]/30 rounded-4xl">
                <TrendingUp className="text-[#34C759]" size={24} />
                <span className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                  +292% заявок за первый месяц
                </span>
              </div>
            </motion.div>

            {/* Right: Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl shadow-2xl"
              >
                <img src="/smile-clinic-dental-website-screenshot.jpg" alt="Smile Clinic Website" className="w-full rounded-3xl" />
                {/* Floating badge */}
                <div className="absolute top-8 right-8 px-4 py-2 bg-[#34C759] rounded-full text-sm font-semibold shadow-lg">
                  Запущен
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: METRICS BAR */}
      <section className="relative py-12 px-4 border-y border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Было */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-4xl"
            >
              <div className="text-sm text-red-400 mb-2">Было</div>
              <div className="text-3xl font-bold text-red-400 mb-1">
                <Counter value={12} /> заявок/мес
              </div>
            </motion.div>

            {/* Metric 2: Стало */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-[#34C759]/10 backdrop-blur-xl border border-[#34C759]/20 rounded-4xl"
            >
              <div className="text-sm text-[#34C759] mb-2">Стало</div>
              <div className="text-3xl font-bold text-[#34C759] mb-1">
                <Counter value={47} /> заявок/мес
              </div>
            </motion.div>

            {/* Metric 3: Рост */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl"
            >
              <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                <TrendingUp size={16} />
                Рост
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-1">
                +<Counter value={292} />%
              </div>
            </motion.div>

            {/* Metric 4: Срок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl"
            >
              <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                <Clock size={16} />
                Срок
              </div>
              <div className="text-3xl font-bold mb-1">
                <Counter value={6} /> дней
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SITUATION */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Исходная ситуация
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 backdrop-blur-xl border-l-4 border-[#34C759] rounded-4xl space-y-8"
          >
            {/* О клиенте */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-[#34C759]" size={24} />
                <h3 className="text-2xl font-semibold">О клиенте</h3>
              </div>
              <p className="text-lg text-white/80 leading-relaxed">
                Smile Clinic — сеть стоматологических клиник в Москве с 2 филиалами. Специализация: терапия,
                имплантация, ортодонтия. Штат 12 врачей.
              </p>
            </div>

            {/* Что было до нас */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-red-400" size={24} />
                <h3 className="text-2xl font-semibold">Что было до нас</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Сайт на Tilda, созданный 3 года назад",
                  "Дизайн устарел, не вызывает доверия",
                  "Нет онлайн-записи — все звонки через администратора",
                  "Сайт медленно загружается (6+ секунд)",
                  "12 заявок в месяц при бюджете на рекламу 80 000₽/мес",
                  "Конверсия сайта: 0.8%",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-white/70"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Цель клиента */}
            <div className="p-6 bg-gradient-to-r from-[#34C759]/10 to-[#00C7BE]/10 border border-[#34C759]/20 rounded-3xl">
              <div className="flex items-start gap-3 mb-3">
                <Zap className="text-[#34C759] flex-shrink-0" size={24} />
                <h3 className="text-xl font-semibold">Цель клиента</h3>
              </div>
              <p className="text-lg italic text-white/90 pl-9">
                "Увеличить поток первичных пациентов, разгрузить администраторов, запустить онлайн-запись"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: CHALLENGES */}
      <section className="relative py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            С чем столкнулись
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "1",
                title: "Сжатые сроки",
                description:
                  "Клиент запланировал запуск новой рекламной кампании через 10 дней. Нужно было успеть запустить сайт до старта рекламы, чтобы не сливать бюджет на старую страницу.",
                icon: Clock,
              },
              {
                number: "2",
                title: "Много контента",
                description:
                  "12 врачей, 25+ услуг, 2 филиала с разными графиками. Нужно было структурировать информацию так, чтобы пациент быстро находил нужное.",
                icon: FileText,
              },
              {
                number: "3",
                title: "Интеграция с YCLIENTS",
                description:
                  "Клиника использует YCLIENTS для записи. Важно было встроить виджет записи так, чтобы он не тормозил сайт и выглядел нативно.",
                icon: Settings,
              },
            ].map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-4xl hover:border-orange-500/40 transition-all group"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {challenge.number}
                </div>

                <challenge.icon className="text-orange-400 mb-4 mt-4" size={32} />
                <h3 className="text-xl font-semibold mb-3">{challenge.title}</h3>
                <p className="text-white/70 leading-relaxed">{challenge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SOLUTION - TIMELINE */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-16 text-center"
          >
            Что мы сделали
          </motion.h2>

          {/* Timeline */}
          <div className="relative space-y-12">
            {/* Glowing line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#34C759] via-[#00C7BE] to-[#34C759] opacity-50" />

            {[
              {
                day: "1",
                title: "Бриф и структура",
                items: [
                  "Провели 40-минутный созвон с владельцем",
                  "Определили приоритетные услуги и УТП",
                  "Согласовали структуру: 8 страниц",
                  "Собрали материалы: фото врачей, тексты",
                ],
                icon: FileText,
              },
              {
                day: "2-3",
                title: "Дизайн и сборка",
                items: [
                  "Собрали сайт из готовых блоков",
                  "Адаптировали дизайн под фирменный стиль (зелёный + белый)",
                  "Добавили блок с врачами с фото и регалиями",
                  "Настроили формы записи на приём",
                ],
                icon: Target,
              },
              {
                day: "4",
                title: "Интеграции",
                items: [
                  "Подключили YCLIENTS с кастомной стилизацией",
                  "Настроили Яндекс.Метрику с целями",
                  "Интегрировали amoCRM для заявок с форм",
                  "Подключили Telegram-уведомления",
                ],
                icon: Settings,
              },
              {
                day: "5",
                title: "Тестирование и правки",
                items: [
                  "Клиент просмотрел сайт, дал комментарии",
                  "Внесли правки: поменяли фото на главной, добавили акцию",
                  "Проверили формы, скорость загрузки, мобильную версию",
                ],
                icon: TestTube,
              },
              {
                day: "6",
                title: "Запуск",
                items: [
                  "Подключили домен, настроили SSL",
                  "Переключили DNS",
                  "Запустили сайт, первая заявка через 2 часа",
                ],
                icon: Rocket,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-6 items-start"
              >
                {/* Day Circle */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#34C759] to-[#00C7BE] rounded-full flex items-center justify-center shadow-lg shadow-[#34C759]/50">
                  <span className="text-xl font-bold">{step.day}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <step.icon className="text-[#34C759]" size={24} />
                    <h3 className="text-2xl font-semibold">{step.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + itemIndex * 0.1 }}
                        className="flex items-start gap-2 text-white/70"
                      >
                        <CheckCircle2 className="text-[#34C759] flex-shrink-0 mt-0.5" size={18} />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: SCREENSHOTS GALLERY */}
      <section className="relative py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Как выглядит сайт
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((screenshot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedImage(index)
                  setIsModalOpen(true)
                }}
                className="group relative p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl cursor-pointer hover:border-[#34C759]/50 transition-all"
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src={screenshot.image || "/placeholder.svg"}
                    alt={screenshot.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="mt-3 text-sm text-center text-white/70 group-hover:text-white transition-colors">
                  {screenshot.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>

          <button
            onClick={() => setSelectedImage((selectedImage - 1 + screenshots.length) % screenshots.length)}
            className="absolute left-4 p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setSelectedImage((selectedImage + 1) % screenshots.length)}
            className="absolute right-4 p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div className="max-w-5xl w-full">
            <img
              src={screenshots[selectedImage].image || "/placeholder.svg"}
              alt={screenshots[selectedImage].title}
              className="w-full rounded-2xl"
            />
            <p className="text-center mt-4 text-lg">{screenshots[selectedImage].title}</p>
          </div>
        </div>
      )}

      {/* SECTION 7: RESULTS */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Результаты</h2>
            <p className="text-xl text-white/70">Через 30 дней после запуска</p>
          </motion.div>

          {/* Results Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto mb-12"
          >
            <div className="inline-block min-w-full p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-white/60">Метрика</th>
                    <th className="text-left py-4 px-4 text-white/60">Было</th>
                    <th className="text-left py-4 px-4 text-white/60">Стало</th>
                    <th className="text-left py-4 px-4 text-white/60">Изменение</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Заявок в месяц", was: "12", now: "47", change: "+292%", positive: true },
                    { metric: "Конверсия сайта", was: "0.8%", now: "2.3%", change: "+187%", positive: true },
                    { metric: "Время на сайте", was: "45 сек", now: "2:10", change: "+189%", positive: true },
                    { metric: "Показатель отказов", was: "68%", now: "34%", change: "-50%", positive: true },
                    { metric: "Скорость загрузки", was: "6.2 сек", now: "1.8 сек", change: "-71%", positive: true },
                    { metric: "Онлайн-записей", was: "0", now: "23", change: "—", positive: true },
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium">{row.metric}</td>
                      <td className="py-4 px-4 text-white/60">{row.was}</td>
                      <td className="py-4 px-4 text-[#34C759] font-semibold">{row.now}</td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${row.positive ? "text-[#34C759]" : "text-white/60"}`}>
                          {row.change}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Additional Outcomes */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Администраторы тратят на 40% меньше времени на запись пациентов",
              "Рекламный бюджет остался тем же, но стоимость заявки снизилась с 6 600₽ до 1 700₽",
              "Клиника планирует открыть 3-й филиал",
            ].map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 border border-[#34C759]/20 rounded-4xl"
              >
                <CheckCircle2 className="text-[#34C759] mb-3" size={28} />
                <p className="text-white/90 leading-relaxed">{outcome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: TESTIMONIAL */}
      <section className="relative py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Отзыв клиента
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl shadow-2xl shadow-[#34C759]/10"
          >
            {/* Decorative Quote Marks */}
            <div className="absolute -top-6 -left-6 text-8xl bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent opacity-30 font-serif">
              "
            </div>

            <blockquote className="text-xl text-white/90 leading-relaxed mb-8 relative z-10">
              Главное — мы не ждали 3 месяца, как с прошлым подрядчиком. Сайт был готов за неделю, реклама запустилась
              вовремя, и заявки пошли сразу. Теперь пациенты записываются сами, администраторы не сидят на телефоне весь
              день. За первый месяц окупили всё вложение.
            </blockquote>

            <div className="flex items-center gap-4">
              <img
                src="/confident-businesswoman.png"
                alt="Анна Петрова"
                className="w-16 h-16 rounded-full border-2 border-[#34C759]"
              />
              <div>
                <div className="font-semibold text-lg">Анна Петрова</div>
                <div className="text-white/60">Владелец Smile Clinic</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: PROJECT SPECS */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Детали проекта
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl"
          >
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { label: "Тариф", value: "Standard" },
                { label: "Setup Fee", value: "19 900₽" },
                { label: "Подписка", value: "2 490₽/мес" },
                { label: "Срок реализации", value: "6 дней" },
                { label: "Количество страниц", value: "8" },
                { label: "Интеграции", value: "YCLIENTS, amoCRM, Яндекс.Метрика" },
                { label: "Дополнительно", value: "Контент-пакет (+15 000₽)" },
              ].map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center pb-4 border-b border-white/10"
                >
                  <span className="text-white/60">{spec.label}</span>
                  <span className="font-semibold text-right">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 10: CTA */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 backdrop-blur-xl border border-[#34C759]/30 rounded-4xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 blur-3xl" />

            <div className="relative z-10 text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Хотите такой же результат?</h2>
              <p className="text-xl text-white/80">Обсудим, как увеличить поток заявок для вашей клиники</p>
            </div>

            {isFormSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="mx-auto mb-4 text-[#34C759]" size={64} />
                <h3 className="text-2xl font-semibold mb-2">Заявка отправлена!</h3>
                <p className="text-white/70">Перезвоним в течение 30 минут</p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="relative z-10 max-w-xl mx-auto space-y-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  required
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full focus:outline-none focus:border-[#34C759] transition-colors text-white placeholder:text-white/50"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  required
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full focus:outline-none focus:border-[#34C759] transition-colors text-white placeholder:text-white/50"
                />
                <textarea
                  placeholder="Кратко о проекте"
                  rows={4}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl focus:outline-none focus:border-[#34C759] transition-colors text-white placeholder:text-white/50 resize-none"
                />
                <Button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 transition-all text-lg font-semibold rounded-full"
                >
                  Обсудить проект
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <p className="text-center text-sm text-white/60">Перезвоним в течение 30 минут</p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* SECTION 11: RELATED CASES */}
      <section className="relative py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Похожие проекты
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {relatedCases.map((caseItem, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl hover:border-[#34C759]/50 hover:-translate-y-2 transition-all"
              >
                <div className="relative overflow-hidden rounded-3xl mb-4">
                  <img
                    src={caseItem.image || "/placeholder.svg"}
                    alt={caseItem.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{caseItem.title}</h3>
                <p className="text-sm text-white/60 mb-3">{caseItem.subtitle}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#34C759]/20 border border-[#34C759]/30 rounded-full">
                  <TrendingUp size={16} className="text-[#34C759]" />
                  <span className="text-sm font-semibold text-[#34C759]">{caseItem.metric}</span>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 text-[#34C759] hover:gap-4 transition-all font-semibold"
            >
              Все кейсы
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
