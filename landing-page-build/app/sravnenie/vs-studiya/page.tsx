"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Check,
  XIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Link from "next/link"

export default function ComparisonVsStudio() {
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [currentStory, setCurrentStory] = useState(0)
  const [expandedCategory, setExpandedCategory] = useState<string | null>("cost")

  const handleQuizAnswer = (points: number) => {
    const newAnswers = [...quizAnswers, points]
    setQuizAnswers(newAnswers)

    if (quizStep < 2) {
      setQuizStep(quizStep + 1)
    } else {
      setShowQuizResult(true)
    }
  }

  const getQuizResult = () => {
    const total = quizAnswers.reduce((sum, points) => sum + points, 0)
    if (total >= 4) return "webconveyor"
    if (total <= -4) return "studio"
    return "both"
  }

  const comparisonCategories = [
    {
      id: "cost",
      icon: "💰",
      title: "СТОИМОСТЬ",
      rows: [
        {
          criteria: "Цена разработки",
          studio: "150 000 — 500 000 ₽",
          us: "9 900 — 34 900 ₽",
          comment: "В 10-15 раз дешевле",
          winner: "us",
        },
        {
          criteria: "Правки после запуска",
          studio: "3 000 — 10 000 ₽/час",
          us: "Включены в подписку",
          comment: "Не платите за каждую мелочь",
          winner: "us",
        },
        {
          criteria: "Годовая стоимость владения",
          studio: "200 000 — 400 000 ₽",
          us: "28 000 — 83 000 ₽",
          comment: "Считаем Setup + 12 мес",
          winner: "us",
        },
        {
          criteria: "Скрытые платежи",
          studio: "Часто (доплаты, правки)",
          us: "Нет",
          comment: "Цена фиксированная",
          winner: "us",
        },
      ],
    },
    {
      id: "time",
      icon: "⏱",
      title: "СРОКИ",
      rows: [
        {
          criteria: "Срок запуска",
          studio: "2 — 6 месяцев",
          us: "7 дней",
          comment: "В 10-20 раз быстрее",
          winner: "us",
        },
        {
          criteria: "Риск срыва сроков",
          studio: "40% проектов",
          us: "0%",
          comment: "Гарантия в договоре",
          winner: "us",
        },
        {
          criteria: "Время на правки",
          studio: "1-2 недели на раунд",
          us: "1-2 дня",
          comment: "Быстрая итерация",
          winner: "us",
        },
      ],
    },
    {
      id: "design",
      icon: "🎨",
      title: "ДИЗАЙН И КАЧЕСТВО",
      rows: [
        {
          criteria: "Уникальность дизайна",
          studio: "Полностью уникальный",
          us: "Кастомизация готовых блоков",
          comment: "Студия выигрывает, но важнее конверсия",
          winner: "studio",
        },
        {
          criteria: "Мобильная версия",
          studio: "Обычно да",
          us: "Всегда",
          comment: "Адаптив по умолчанию",
          winner: "tie",
        },
        {
          criteria: "Скорость загрузки",
          studio: "Зависит от команды",
          us: "< 2 сек",
          comment: "Оптимизировано изначально",
          winner: "us",
        },
      ],
    },
    {
      id: "features",
      icon: "🔧",
      title: "ФУНКЦИОНАЛ",
      rows: [
        {
          criteria: "Сложные интеграции",
          studio: "Любые",
          us: "Популярные CRM + сервисы",
          comment: "Студия гибче",
          winner: "studio",
        },
        {
          criteria: "Личный кабинет, API",
          studio: "Да",
          us: "Нет",
          comment: "Не наша специализация",
          winner: "studio",
        },
        {
          criteria: "Формы и заявки",
          studio: "Да",
          us: "Да",
          comment: "Одинаково",
          winner: "tie",
        },
        {
          criteria: "Онлайн-запись",
          studio: "За доплату",
          us: "Включено (YCLIENTS)",
          comment: "У нас проще",
          winner: "us",
        },
        {
          criteria: "Аналитика",
          studio: "Настройка за отдельную плату",
          us: "Включена",
          comment: "У нас из коробки",
          winner: "us",
        },
      ],
    },
    {
      id: "support",
      icon: "🛠",
      title: "ПОДДЕРЖКА",
      rows: [
        {
          criteria: "Техподдержка",
          studio: "Отдельный договор, от 15 000₽/мес",
          us: "Включена",
          comment: "Не нужно искать отдельно",
          winner: "us",
        },
        {
          criteria: "Время реакции",
          studio: "1-5 рабочих дней",
          us: "4-24 часа",
          comment: "Быстрее в 3-5 раз",
          winner: "us",
        },
        {
          criteria: "Обновления контента",
          studio: "Через менеджера, платно",
          us: "Сами или мы бесплатно",
          comment: "Гибче",
          winner: "us",
        },
      ],
    },
    {
      id: "process",
      icon: "📋",
      title: "ПРОЦЕСС",
      rows: [
        {
          criteria: "Согласования",
          studio: "5-15 этапов",
          us: "3 этапа",
          comment: "Меньше бюрократии",
          winner: "us",
        },
        {
          criteria: "Участие клиента",
          studio: "10-20 часов вашего времени",
          us: "2-3 часа",
          comment: "Экономите время",
          winner: "us",
        },
        {
          criteria: "Понятность процесса",
          studio: "Сложно",
          us: "Просто",
          comment: "Всё прозрачно",
          winner: "us",
        },
      ],
    },
    {
      id: "risks",
      icon: "⚠️",
      title: "РИСКИ",
      rows: [
        {
          criteria: "Исполнитель пропадёт",
          studio: "Низкий (компания)",
          us: "Низкий (система)",
          comment: "Одинаково",
          winner: "tie",
        },
        {
          criteria: "Результат не понравится",
          studio: "Сложно переделать",
          us: "1 раунд правок включён",
          comment: "У нас гибче",
          winner: "us",
        },
        {
          criteria: "Зависимость от подрядчика",
          studio: "Средняя",
          us: "Можно уйти с данными",
          comment: "Ваши данные — ваши",
          winner: "us",
        },
      ],
    },
  ]

  const migrationStories = [
    {
      quote:
        "Два года назад заплатили студии 280 000 ₽. Сайт делали 5 месяцев. Через год нужны были правки — выставили счёт ещё на 40 000. Плюнули, пришли сюда. За 20 000 получили то же самое за неделю.",
      author: "Сергей",
      role: "владелец автосервиса",
    },
    {
      quote:
        "Студия обещала сдать за 2 месяца, в итоге 4.5 месяца. К тому времени рекламный бюджет простаивал, потеряли примерно 200 000 ₽ на упущенных заявках.",
      author: "Мария",
      role: "стоматология",
    },
    {
      quote:
        "Не то чтобы студия плохо сделала — сайт красивый. Но для моего бизнеса это overkill. Переплатил в 5 раз за функции, которые не использую.",
      author: "Алексей",
      role: "юрист",
    },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#34C759]/20 via-[#00C7BE]/20 to-[#34C759]/10 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <Home size={16} />
            <span className="group-hover:translate-x-1 transition-transform">Вернуться на главную</span>
          </Link>
        </div>

        {/* 1. HERO SECTION */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-white/60 mb-8"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <span>→</span>
            <span>Сравнение</span>
            <span>→</span>
            <span className="text-white">vs Веб-студия</span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6"
          >
            <Sparkles size={16} className="text-[#34C759]" />
            <span className="text-sm">Честное сравнение</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-balance"
          >
            WebConveyor vs Веб-студия
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 mb-12 max-w-3xl text-pretty"
          >
            Разбираем ключевые отличия, чтобы вы могли принять взвешенное решение
          </motion.p>

          {/* Split Hero Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 relative">
            {/* VS Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#34C759] to-[#00C7BE] flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#34C759]/50 animate-pulse">
                VS
              </div>
            </motion.div>

            {/* Competitor Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-3">Веб-студия</h3>
              <p className="text-white/60">Традиционный подход к созданию сайтов</p>
            </motion.div>

            {/* Our Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-4xl bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 backdrop-blur-xl border border-[#34C759]/20"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">WebConveyor</h3>
              <p className="text-white/70">Продуктовый конвейер для быстрого запуска</p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Button
              asChild
              className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 transition-all text-white rounded-full"
            >
              <Link href="/calculator">
                Рассчитать стоимость <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* 2. QUICK VERDICT SECTION */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-12 text-center"
          >
            Коротко: для кого что подходит
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Studio Fits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-white/60">🏢</span>
                Веб-студия подойдёт, если:
              </h3>
              <ul className="space-y-3">
                {[
                  "Бюджет от 300 000 ₽",
                  "Есть 3-6 месяцев на разработку",
                  "Нужен полностью уникальный дизайн",
                  "Сложный функционал (личный кабинет, API)",
                  "Готовы к долгим согласованиям",
                  "Крупный бизнес с штатом менеджеров",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={20} className="text-white/40 mt-0.5 flex-shrink-0" />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* We Fit */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-4xl bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 backdrop-blur-xl border border-[#34C759]/20"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#34C759]">⚡</span>
                WebConveyor подойдёт, если:
              </h3>
              <ul className="space-y-3">
                {[
                  "Бюджет 10 000 — 50 000 ₽",
                  "Нужен сайт за 1-2 недели",
                  "Важен результат, а не процесс",
                  "Малый или средний бизнес услуг",
                  "Не хотите разбираться в технических деталях",
                  "Нужна постоянная поддержка",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={20} className="text-[#34C759] mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 3. MAIN COMPARISON TABLE */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-12 text-center"
          >
            Детальное сравнение
          </motion.h2>

          <div className="space-y-4">
            {comparisonCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-xl font-bold">{category.title}</span>
                  </div>
                  <ChevronRight
                    className={`transition-transform ${expandedCategory === category.id ? "rotate-90" : ""}`}
                  />
                </button>

                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 space-y-4">
                      {category.rows.map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className={`p-4 rounded-2xl ${
                            row.winner === "us"
                              ? "bg-[#34C759]/10 border border-[#34C759]/20"
                              : row.winner === "studio"
                                ? "bg-white/5 border border-white/10"
                                : "bg-yellow-500/10 border border-yellow-500/20"
                          }`}
                        >
                          <div className="grid md:grid-cols-4 gap-4">
                            <div className="font-semibold">{row.criteria}</div>
                            <div className="text-white/70">{row.studio}</div>
                            <div className="text-white/90">{row.us}</div>
                            <div className="text-sm text-white/60 italic">{row.comment}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. VISUAL COMPARISON CARDS */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 text-center"
          >
            Наглядно: один и тот же проект
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-white/60 mb-12 text-center"
          >
            Как бы выглядел заказ сайта для стоматологии
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Studio Project */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6">Веб-студия</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-white/60 text-sm mb-1">Бюджет</div>
                  <div className="text-2xl font-bold">250 000 ₽</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Срок</div>
                  <div className="text-2xl font-bold">4 месяца</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex gap-3">
                  <div className="text-white/40">├─</div>
                  <div className="text-white/70">Месяц 1: Бриф, ТЗ, согласования (3-4 созвона)</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-white/40">├─</div>
                  <div className="text-white/70">Месяц 2: Дизайн-концепция, правки (5 итераций)</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-white/40">├─</div>
                  <div className="text-white/70">Месяц 3: Вёрстка, разработка</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-white/40">├─</div>
                  <div className="text-white/70">Месяц 4: Тестирование, наполнение, запуск</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-white/40">└─</div>
                  <div className="text-white/70">Итог: Сайт готов, но устали от процесса</div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="text-sm text-white/60 mb-2">Дополнительно:</div>
                <div className="space-y-2 text-white/70">
                  <div>• Правки после запуска: ~30 000 ₽</div>
                  <div>• Поддержка: 15 000 ₽/мес</div>
                  <div className="text-lg font-bold text-white mt-4">= Первый год: 310 000 ₽</div>
                </div>
              </div>
            </motion.div>

            {/* Our Project */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-4xl bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 backdrop-blur-xl border border-[#34C759]/20"
            >
              <h3 className="text-2xl font-bold mb-6">WebConveyor</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-white/60 text-sm mb-1">Бюджет</div>
                  <div className="text-2xl font-bold">19 900 ₽ + 2 490 ₽/мес</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Срок</div>
                  <div className="text-2xl font-bold">7 дней</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex gap-3">
                  <div className="text-[#34C759]">├─</div>
                  <div className="text-white/90">День 1: Бриф 30 мин, материалы</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[#34C759]">├─</div>
                  <div className="text-white/90">День 2-4: Сборка сайта</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[#34C759]">├─</div>
                  <div className="text-white/90">День 5-6: Ревью, правки</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[#34C759]">├─</div>
                  <div className="text-white/90">День 7: Запуск!</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-[#34C759]">└─</div>
                  <div className="text-white/90 font-semibold">Итог: Сайт работает, заявки идут</div>
                </div>
              </div>

              <div className="border-t border-[#34C759]/20 pt-6">
                <div className="text-sm text-white/60 mb-2">Включено:</div>
                <div className="space-y-2 text-white/90">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-[#34C759]" />
                    Правки в рамках подписки
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-[#34C759]" />
                    Поддержка включена
                  </div>
                  <div className="text-lg font-bold text-white mt-4">= Первый год: 49 780 ₽</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-8 rounded-4xl bg-gradient-to-r from-[#34C759]/20 to-[#00C7BE]/20 backdrop-blur-xl border border-[#34C759]/30"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-[#34C759] mb-2">260 000 ₽</div>
                <div className="text-white/60">Экономия</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#34C759] mb-2">3.5 месяца</div>
                <div className="text-white/60">Времени сэкономлено</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#34C759] mb-2">50-100</div>
                <div className="text-white/60">Упущенных заявок за время ожидания</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 5. HONEST PROS & CONS */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 text-center"
          >
            Честно о минусах
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-white/60 mb-12 text-center"
          >
            Мы не идеальны — вот что нужно знать
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Where Studio is Better */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-white/60" />
                <h3 className="text-xl font-bold">Где веб-студия лучше</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: "🎨", text: "Полностью уникальный дизайн, не похожий ни на что" },
                  { icon: "🔧", text: "Любой сложный функционал: личные кабинеты, сложные калькуляторы" },
                  { icon: "👥", text: "Большая команда для масштабных проектов" },
                  { icon: "📋", text: "Детальное ТЗ и документация" },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white/70">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Where We're Better */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-4xl bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 backdrop-blur-xl border border-[#34C759]/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-[#34C759]" />
                <h3 className="text-xl font-bold">Где мы лучше</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: "⚡", text: "Скорость: 7 дней vs 3-6 месяцев" },
                  { icon: "💰", text: "Цена: в 10 раз дешевле" },
                  { icon: "🛡️", text: "Включённая поддержка, не бросаем после запуска" },
                  { icon: "📊", text: "Готовые решения, проверенные на 150+ сайтах" },
                  { icon: "⏰", text: "Минимум вашего времени" },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white/90">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* When NOT for us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-4xl bg-red-500/10 backdrop-blur-xl border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingDown className="text-red-400" />
                <h3 className="text-xl font-bold">Когда точно НЕ к нам</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Нужен интернет-магазин с каталогом 1000+ товаров",
                  "Требуется личный кабинет с оплатой",
                  "Бюджет меньше 10 000 ₽ (попробуйте Tilda)",
                  "Нужен полностью уникальный дизайн с нуля",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XIcon size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 6. MIGRATION STORIES */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 text-center"
          >
            Истории перехода
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-white/60 mb-12 text-center"
          >
            Клиенты, которые пришли к нам от веб-студий
          </motion.p>

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={currentStory}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-10 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="text-6xl text-[#34C759]/30 mb-4">"</div>
              <p className="text-xl text-white/90 mb-6 italic">{migrationStories[currentStory].quote}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#34C759] to-[#00C7BE]" />
                <div>
                  <div className="font-semibold">{migrationStories[currentStory].author}</div>
                  <div className="text-sm text-white/60">{migrationStories[currentStory].role}</div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentStory((prev) => (prev === 0 ? migrationStories.length - 1 : prev - 1))}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <ChevronLeft />
              </button>

              <div className="flex gap-2">
                {migrationStories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStory(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStory ? "w-8 bg-[#34C759]" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentStory((prev) => (prev === migrationStories.length - 1 ? 0 : prev + 1))}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </section>

        {/* 7. DECISION HELPER QUIZ */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 text-center"
          >
            Не уверены? Проверьте
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-white/60 mb-12 text-center"
          >
            3 вопроса, чтобы понять, что подойдёт вам
          </motion.p>

          <div className="max-w-3xl mx-auto">
            {!showQuizResult ? (
              <motion.div
                key={quizStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10"
              >
                <div className="mb-6">
                  <div className="text-sm text-white/60 mb-2">Вопрос {quizStep + 1} из 3</div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] transition-all"
                      style={{ width: `${((quizStep + 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {quizStep === 0 && (
                  <>
                    <h3 className="text-2xl font-bold mb-6">Какой у вас бюджет на сайт?</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleQuizAnswer(2)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-[#34C759]/10 border border-white/10 hover:border-[#34C759]/30 transition-all text-left"
                      >
                        До 30 000 ₽
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(0)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
                      >
                        30 000 — 150 000 ₽
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(-2)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
                      >
                        Больше 150 000 ₽
                      </button>
                    </div>
                  </>
                )}

                {quizStep === 1 && (
                  <>
                    <h3 className="text-2xl font-bold mb-6">Когда нужен готовый сайт?</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleQuizAnswer(2)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-[#34C759]/10 border border-white/10 hover:border-[#34C759]/30 transition-all text-left"
                      >
                        В течение 2 недель
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(0)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
                      >
                        В течение 1-2 месяцев
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(-2)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
                      >
                        Могу ждать 3+ месяца
                      </button>
                    </div>
                  </>
                )}

                {quizStep === 2 && (
                  <>
                    <h3 className="text-2xl font-bold mb-6">Что важнее?</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleQuizAnswer(2)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-[#34C759]/10 border border-white/10 hover:border-[#34C759]/30 transition-all text-left"
                      >
                        Результат (заявки, продажи)
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(-2)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
                      >
                        Уникальность и имидж
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(0)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
                      >
                        Одинаково важно
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-8 rounded-4xl backdrop-blur-xl border ${
                  getQuizResult() === "webconveyor"
                    ? "bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 border-[#34C759]/30"
                    : getQuizResult() === "studio"
                      ? "bg-white/5 border-white/10"
                      : "bg-yellow-500/10 border-yellow-500/20"
                }`}
              >
                <h3 className="text-2xl font-bold mb-4">Результат:</h3>
                {getQuizResult() === "webconveyor" && (
                  <>
                    <p className="text-xl mb-6">
                      Вам больше подойдёт <span className="text-[#34C759] font-bold">WebConveyor</span>
                    </p>
                    <p className="text-white/70 mb-6">
                      Исходя из ваших ответов, наш подход лучше соответствует вашим потребностям. Мы сможем быстро
                      запустить сайт в рамках вашего бюджета и обеспечить постоянную поддержку.
                    </p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 text-white rounded-full"
                    >
                      <Link href="/calculator">
                        Рассчитать стоимость <ArrowRight className="ml-2" size={16} />
                      </Link>
                    </Button>
                  </>
                )}

                {getQuizResult() === "studio" && (
                  <>
                    <p className="text-xl mb-6">
                      Вам больше подойдёт <span className="font-bold">Веб-студия</span>
                    </p>
                    <p className="text-white/70 mb-6">
                      Исходя из ваших ответов, похоже, что традиционная веб-студия лучше справится с вашими задачами.
                      Они смогут предложить полностью уникальное решение и реализовать сложный функционал.
                    </p>
                    <div className="text-sm text-white/60">
                      Мы честно рекомендуем изучить предложения профессиональных студий. Если что-то изменится — всегда
                      рады помочь!
                    </div>
                  </>
                )}

                {getQuizResult() === "both" && (
                  <>
                    <p className="text-xl mb-6">
                      Подходят <span className="font-bold">оба варианта</span>
                    </p>
                    <p className="text-white/70 mb-6">
                      Ваши требования находятся на стыке возможностей обоих подходов. Рекомендуем получить консультацию
                      и сравнить конкретные предложения.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 text-white rounded-full"
                      >
                        <Link href="/calculator">Рассчитать у нас</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full border-white/20 hover:bg-white/10 bg-transparent"
                      >
                        Задать вопрос
                      </Button>
                    </div>
                  </>
                )}

                <button
                  onClick={() => {
                    setQuizStep(0)
                    setQuizAnswers([])
                    setShowQuizResult(false)
                  }}
                  className="mt-6 text-white/60 hover:text-white transition-colors text-sm"
                >
                  ← Пройти заново
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* 8. COMPARISON SWITCHER */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-12 text-center"
          >
            Сравните с другими вариантами
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/sravnenie/vs-frilanser"
              className="p-8 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/30 transition-all group"
            >
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#34C759] transition-colors">vs Фрилансер</h3>
              <p className="text-white/60 mb-4">Дешевле, но рискованнее</p>
              <div className="flex items-center gap-2 text-[#34C759] opacity-0 group-hover:opacity-100 transition-opacity">
                Перейти к сравнению <ArrowRight size={16} />
              </div>
            </Link>

            <div className="p-8 rounded-4xl bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 backdrop-blur-xl border-2 border-[#34C759] relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#34C759] text-xs font-bold">
                Вы здесь
              </div>
              <h3 className="text-2xl font-bold mb-3">vs Веб-студия</h3>
              <p className="text-white/70 mb-4">Дорого и долго, но уникально</p>
            </div>

            <Link
              href="/sravnenie/vs-konstruktor"
              className="p-8 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/30 transition-all group"
            >
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#34C759] transition-colors">vs Конструктор</h3>
              <p className="text-white/60 mb-4">Бесплатно, но сами и сложно</p>
              <div className="flex items-center gap-2 text-[#34C759] opacity-0 group-hover:opacity-100 transition-opacity">
                Перейти к сравнению <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </section>

        {/* 9. FINAL CTA */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-4xl bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 backdrop-blur-xl border border-[#34C759]/30 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Готовы сравнить на практике?</h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Оставьте заявку — покажем, как это работает для вашего бизнеса
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 text-white rounded-full"
              >
                <Link href="/calculator">
                  Рассчитать стоимость <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 hover:bg-white/10 bg-transparent"
              >
                <a href="https://t.me/webconveyor" target="_blank" rel="noopener noreferrer">
                  Задать вопрос в Telegram
                </a>
              </Button>
            </div>

            <p className="text-sm text-white/60">
              Консультация бесплатная. Если поймём, что студия подойдёт лучше — честно скажем.
            </p>
          </motion.div>
        </section>

        {/* 10. FAQ */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-12 text-center"
          >
            Вопросы о сравнении
          </motion.h2>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  Почему вы так дёшево, если студии берут от 200К?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Мы не делаем каждый сайт с нуля. У нас система готовых блоков, которые мы собираем и кастомизируем.
                  Это как IKEA vs мебель на заказ — качественно, но в 10 раз быстрее и дешевле.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">Получится ли уникальный дизайн?</AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Уникальный в рамках нашей системы — да. Ваш сайт не будет копией других. Но если нужен дизайн с нуля
                  от известного дизайнера — это к студиям.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  А если мне потом понадобится сложный функционал?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Базовый функционал добавим в рамках системы. Если нужно что-то очень специфичное (личный кабинет,
                  сложные API) — поможем найти студию-партнёра или возьмём как отдельный проект.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">Вы правда за 7 дней делаете?</AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Да, если вы предоставляете материалы вовремя. За 3+ года ни разу не сорвали сроки. В договоре есть
                  гарантия — если опоздаем, вернём часть оплаты.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  Могу ли я сначала попробовать студию, а потом прийти к вам?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Конечно. Многие так и делают. Если опыт со студией не понравится — мы сможем сделать сайт за неделю и
                  сэкономить ваше время.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="container mx-auto px-4 text-center text-white/60">
            <p>&copy; 2026 WebConveyor. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
