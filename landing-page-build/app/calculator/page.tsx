"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, ArrowLeft, X } from "lucide-react"

interface CalculatorState {
  step: 1 | 2 | 3 | 4 | 5
  businessType: string | null
  projectType: "new" | "redesign" | "add_features" | null
  features: string[]
  timeline: "urgent" | "standard" | "month" | "flexible" | null
  result: {
    recommendedPlan: "lite" | "standard" | "pro"
    setupFee: number
    monthly: number
    addons: { name: string; price: number }[]
    total: number
    firstYear: number
  } | null
}

const PLANS = {
  lite: { setup: 9900, monthly: 1490 },
  standard: { setup: 19900, monthly: 2490 },
  pro: { setup: 34900, monthly: 3990 },
}

const ADDONS: Record<string, number> = {
  yclients: 15000,
}

const TIMELINE_MODIFIERS = {
  urgent: 1.5,
  standard: 1.0,
  month: 1.0,
  flexible: 0.9,
}

export default function CalculatorPage() {
  const [state, setState] = useState<CalculatorState>({
    step: 1,
    businessType: null,
    projectType: null,
    features: ["forms", "mobile"],
    timeline: null,
    result: null,
  })

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const businessTypes = [
    { id: "medical", emoji: "🦷", label: "Медицина" },
    { id: "b2b", emoji: "⚖️", label: "Услуги B2B" },
    { id: "beauty", emoji: "💇", label: "Красота" },
    { id: "auto", emoji: "🔧", label: "Авто" },
    { id: "renovation", emoji: "🏠", label: "Ремонт" },
    { id: "other", emoji: "📦", label: "Другое" },
  ]

  const projectTypes = [
    {
      id: "new",
      title: "Создать новый сайт с нуля",
      description: "Сайта ещё нет или текущий нужно заменить полностью",
    },
    {
      id: "redesign",
      title: "Переделать/обновить существующий",
      description: "Есть сайт, но он устарел или плохо работает",
    },
    {
      id: "add_features",
      title: "Добавить функционал к текущему",
      description: "Сайт устраивает, но нужны дополнительные функции",
    },
  ]

  const featuresList = [
    {
      id: "forms",
      title: "Формы для сбора заявок",
      description: "Базовый функционал, включён во все тарифы",
      disabled: true,
      tag: null,
    },
    {
      id: "mobile",
      title: "Мобильная адаптация",
      description: "Корректное отображение на телефонах и планшетах",
      disabled: true,
      tag: null,
    },
    {
      id: "crm",
      title: "Интеграция с CRM",
      description: "Заявки автоматически попадают в amoCRM или Bitrix24",
      disabled: false,
      tag: "Standard+",
      tagColor: "cyan",
    },
    {
      id: "yclients",
      title: "Онлайн-запись (YCLIENTS)",
      description: "Клиенты записываются сами, выбирая время и специалиста",
      disabled: false,
      tag: "+15 000₽",
      tagColor: "green",
    },
    {
      id: "analytics",
      title: "Расширенная аналитика",
      description: "Отслеживание целей, конверсий, источников заявок",
      disabled: false,
      tag: "Standard+",
      tagColor: "cyan",
    },
    {
      id: "ab_testing",
      title: "A/B тестирование",
      description: "Тестирование разных версий страниц для повышения конверсии",
      disabled: false,
      tag: "Pro",
      tagColor: "purple",
    },
    {
      id: "quiz",
      title: "Квиз-формы",
      description: "Интерактивные опросники для квалификации лидов",
      disabled: false,
      tag: "Pro",
      tagColor: "purple",
    },
    {
      id: "multi_funnel",
      title: "Несколько воронок",
      description: "Разные страницы под разные услуги или акции",
      disabled: false,
      tag: "Pro",
      tagColor: "purple",
    },
  ]

  const timelineOptions = [
    {
      id: "urgent",
      title: "Срочно — в течение недели",
      description: "Приоритетная работа, запуск за 3-5 дней",
      tag: "+50% к Setup",
      tagColor: "red",
    },
    {
      id: "standard",
      title: "Стандартно — 1-2 недели",
      description: "Оптимальные сроки для качественного результата",
      tag: "Рекомендуем",
      tagColor: "green",
    },
    {
      id: "month",
      title: "В течение месяца",
      description: "Комфортный темп, время на доработки",
      tag: null,
      tagColor: null,
    },
    {
      id: "flexible",
      title: "Не срочно — планирую заранее",
      description: "Гибкие сроки, возможна скидка на Setup",
      tag: "Скидка 10%",
      tagColor: "cyan",
    },
  ]

  const recommendPlan = (features: string[]): "lite" | "standard" | "pro" => {
    const needsPro = features.some((f) => ["ab_testing", "quiz", "multi_funnel"].includes(f))
    const needsStandard = features.some((f) => ["crm", "analytics"].includes(f))

    if (needsPro) return "pro"
    if (needsStandard) return "standard"
    return "lite"
  }

  const calculateResult = () => {
    const plan = recommendPlan(state.features)
    const basePlan = PLANS[plan]
    const timelineModifier = TIMELINE_MODIFIERS[state.timeline || "standard"]

    const setupFee = Math.round(basePlan.setup * timelineModifier)
    const monthly = basePlan.monthly

    const addons: { name: string; price: number }[] = []
    if (state.features.includes("yclients")) {
      addons.push({ name: "YCLIENTS интеграция", price: ADDONS.yclients })
    }

    const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0)
    const total = setupFee + addonsTotal + monthly
    const firstYear = setupFee + addonsTotal + monthly * 12

    setState({
      ...state,
      step: 5,
      result: {
        recommendedPlan: plan,
        setupFee,
        monthly,
        addons,
        total,
        firstYear,
      },
    })
  }

  const handleNext = () => {
    if (state.step === 4) {
      calculateResult()
    } else {
      setState({ ...state, step: (state.step + 1) as any })
    }
  }

  const handleBack = () => {
    setState({ ...state, step: (state.step - 1) as any })
  }

  const toggleFeature = (featureId: string) => {
    if (featureId === "forms" || featureId === "mobile") return

    setState({
      ...state,
      features: state.features.includes(featureId)
        ? state.features.filter((f) => f !== featureId)
        : [...state.features, featureId],
    })
  }

  const canProceed = () => {
    if (state.step === 1) return state.businessType !== null
    if (state.step === 2) return state.projectType !== null
    if (state.step === 3) return true
    if (state.step === 4) return state.timeline !== null
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const resetCalculator = () => {
    setState({
      step: 1,
      businessType: null,
      projectType: null,
      features: ["forms", "mobile"],
      timeline: null,
      result: null,
    })
    setIsSubmitted(false)
  }

  const getPlanName = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1)
  }

  const getAlternativePlans = () => {
    if (!state.result) return []
    const current = state.result.recommendedPlan
    const plans = ["lite", "standard", "pro"].filter((p) => p !== current)
    return plans as ("lite" | "standard" | "pro")[]
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
              onClick={() => (window.location.href = "/")}
              variant="ghost"
              className="text-white hover:text-[#34C759]"
            >
              <X className="mr-2" size={16} />
              Закрыть
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-white/60 mb-8"
          >
            <a href="/" className="hover:text-[#34C759] transition-colors">
              Главная
            </a>
            <span>→</span>
            <span className="text-white">Калькулятор</span>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Рассчитайте стоимость сайта</h1>
            <p className="text-xl text-white/70 mb-2">Ответьте на 4 вопроса — покажем подходящий тариф и точную цену</p>
            <p className="text-sm text-white/50">Займёт меньше минуты</p>
          </motion.div>

          {/* Calculator Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 md:p-12 shadow-2xl">
              {/* Progress Indicator */}
              {state.step < 5 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {[1, 2, 3, 4].map((stepNum) => (
                      <div key={stepNum} className="flex items-center">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                            stepNum === state.step
                              ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] shadow-lg shadow-[#34C759]/50 scale-110"
                              : stepNum < state.step
                                ? "bg-[#34C759]"
                                : "bg-white/10 border border-white/20"
                          }`}
                          animate={stepNum === state.step ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {stepNum < state.step ? <Check size={20} /> : stepNum}
                        </motion.div>
                        {stepNum < 4 && (
                          <div
                            className={`h-0.5 w-12 md:w-24 mx-2 transition-all ${
                              stepNum < state.step ? "bg-[#34C759]" : "bg-white/10"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between max-w-2xl mx-auto mt-2 px-5">
                    <span className="text-xs text-white/50">Бизнес</span>
                    <span className="text-xs text-white/50">Проект</span>
                    <span className="text-xs text-white/50">Функции</span>
                    <span className="text-xs text-white/50">Сроки</span>
                  </div>
                </div>
              )}

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {/* Step 1: Business Type */}
                {state.step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-3 text-center">Какой у вас бизнес?</h2>
                    <p className="text-white/60 text-center mb-8">Выберите сферу деятельности</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {businessTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          onClick={() => setState({ ...state, businessType: type.id })}
                          className={`p-6 rounded-4xl border transition-all ${
                            state.businessType === type.id
                              ? "bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 border-[#34C759] shadow-lg shadow-[#34C759]/30 scale-105"
                              : "bg-white/5 border-white/10 hover:border-white/30 hover:scale-102"
                          }`}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-4xl mb-3">{type.emoji}</div>
                          <div className="font-semibold">{type.label}</div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                      >
                        Далее <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Type */}
                {state.step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-3 text-center">Что нужно сделать с сайтом?</h2>
                    <p className="text-white/60 text-center mb-8">Выберите тип проекта</p>

                    <div className="space-y-4 mb-8">
                      {projectTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          onClick={() => setState({ ...state, projectType: type.id as any })}
                          className={`w-full p-6 rounded-4xl border transition-all text-left ${
                            state.projectType === type.id
                              ? "bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 border-[#34C759] shadow-lg shadow-[#34C759]/30"
                              : "bg-white/5 border-white/10 hover:border-white/30"
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                                state.projectType === type.id
                                  ? "border-[#34C759] bg-gradient-to-r from-[#34C759] to-[#00C7BE]"
                                  : "border-white/30"
                              }`}
                            >
                              {state.projectType === type.id && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-lg mb-1">{type.title}</div>
                              <div className="text-sm text-white/60">{type.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        variant="ghost"
                        className="text-white hover:text-[#34C759] rounded-full"
                      >
                        <ArrowLeft className="mr-2" size={16} />
                        Назад
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 disabled:opacity-50 rounded-full"
                      >
                        Далее <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Features */}
                {state.step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-3 text-center">Какие функции вам нужны?</h2>
                    <p className="text-white/60 text-center mb-8">Выберите всё, что важно для вашего проекта</p>

                    <div className="space-y-3 mb-8 max-h-[500px] overflow-y-auto pr-2">
                      {featuresList.map((feature) => (
                        <motion.button
                          key={feature.id}
                          onClick={() => toggleFeature(feature.id)}
                          disabled={feature.disabled}
                          className={`w-full p-5 rounded-4xl border transition-all text-left ${
                            state.features.includes(feature.id)
                              ? "bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 border-[#34C759]/50 shadow-md"
                              : "bg-white/5 border-white/10 hover:border-white/30"
                          } ${feature.disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                          whileHover={!feature.disabled ? { x: 4 } : {}}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-1 flex-shrink-0 transition-all ${
                                state.features.includes(feature.id)
                                  ? "border-[#34C759] bg-gradient-to-r from-[#34C759] to-[#00C7BE]"
                                  : "border-white/30 bg-white/5"
                              }`}
                            >
                              {state.features.includes(feature.id) && <Check size={14} className="text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-semibold">{feature.title}</div>
                                {feature.tag && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      feature.tagColor === "cyan"
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                        : feature.tagColor === "purple"
                                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                          : "bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30"
                                    }`}
                                  >
                                    {feature.tag}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-white/60">{feature.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        variant="ghost"
                        className="text-white hover:text-[#34C759] rounded-full"
                      >
                        <ArrowLeft className="mr-2" size={16} />
                        Назад
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 rounded-full"
                      >
                        Далее <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Timeline */}
                {state.step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-3 text-center">Когда нужен готовый сайт?</h2>
                    <p className="text-white/60 text-center mb-8">Срочность влияет на финальную стоимость</p>

                    <div className="space-y-4 mb-8">
                      {timelineOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => setState({ ...state, timeline: option.id as any })}
                          className={`w-full p-6 rounded-4xl border transition-all text-left ${
                            state.timeline === option.id
                              ? "bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 border-[#34C759] shadow-lg shadow-[#34C759]/30"
                              : "bg-white/5 border-white/10 hover:border-white/30"
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                                state.timeline === option.id
                                  ? "border-[#34C759] bg-gradient-to-r from-[#34C759] to-[#00C7BE]"
                                  : "border-white/30"
                              }`}
                            >
                              {state.timeline === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-semibold text-lg">{option.title}</div>
                                {option.tag && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      option.tagColor === "red"
                                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                        : option.tagColor === "green"
                                          ? "bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30"
                                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    }`}
                                  >
                                    {option.tag}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-white/60">{option.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        variant="ghost"
                        className="text-white hover:text-[#34C759] rounded-full"
                      >
                        <ArrowLeft className="mr-2" size={16} />
                        Назад
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 disabled:opacity-50 rounded-full px-8"
                      >
                        Рассчитать <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Results */}
                {state.step === 5 && state.result && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {!isSubmitted ? (
                      <>
                        <div className="text-center mb-8">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="text-6xl mb-4"
                          >
                            🎉
                          </motion.div>
                          <h2 className="text-3xl font-bold mb-3">Ваш расчёт готов!</h2>
                          <p className="text-white/60">
                            Для {state.businessType === "medical" ? "медицинской клиники" : "вашего бизнеса"}{" "}
                            рекомендуем тариф {getPlanName(state.result.recommendedPlan)}
                          </p>
                        </div>

                        {/* Recommended Plan */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 border-2 border-[#34C759] rounded-4xl p-8 mb-6 shadow-2xl shadow-[#34C759]/20"
                        >
                          <div className="text-center mb-6">
                            <div className="text-sm text-[#34C759] mb-2">Рекомендуемый тариф</div>
                            <div className="text-4xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                              {getPlanName(state.result.recommendedPlan).toUpperCase()}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 text-center">
                              <div className="text-sm text-white/60 mb-1">Setup Fee</div>
                              <div className="text-2xl font-bold">{state.result.setupFee.toLocaleString()} ₽</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 text-center">
                              <div className="text-sm text-white/60 mb-1">Подписка</div>
                              <div className="text-2xl font-bold">{state.result.monthly.toLocaleString()} ₽/мес</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 text-center">
                              <div className="text-sm text-white/60 mb-1">Первый год</div>
                              <div className="text-2xl font-bold">{state.result.firstYear.toLocaleString()} ₽</div>
                            </div>
                          </div>

                          <div className="border-t border-white/10 pt-6">
                            <div className="text-sm font-semibold mb-3">Что входит в тариф:</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {state.result.recommendedPlan === "lite" && (
                                <>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    До 5 страниц
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />3 формы захвата
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Email-поддержка
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Запуск за 10 дней
                                  </div>
                                </>
                              )}
                              {state.result.recommendedPlan === "standard" && (
                                <>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    До 10 страниц
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Безлимит форм захвата
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Интеграция с CRM
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Расширенная аналитика
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Telegram-поддержка
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Запуск за 7 дней
                                  </div>
                                </>
                              )}
                              {state.result.recommendedPlan === "pro" && (
                                <>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Безлимит страниц
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Всё из Standard
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    A/B тестирование
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Квиз-формы
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Приоритет поддержки
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check size={16} className="text-[#34C759]" />
                                    Запуск за 5 дней
                                  </div>
                                </>
                              )}
                            </div>

                            {state.result.addons.length > 0 && (
                              <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="text-sm font-semibold mb-3">Дополнительно выбрано:</div>
                                {state.result.addons.map((addon, index) => (
                                  <div key={index} className="flex justify-between text-sm mb-2">
                                    <span className="text-white/70">+ {addon.name}</span>
                                    <span className="font-semibold">{addon.price.toLocaleString()} ₽</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-white/10">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">ИТОГО к оплате:</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                                  {state.result.total.toLocaleString()} ₽
                                </span>
                              </div>
                              <div className="text-xs text-white/50 text-right mt-1">
                                (Setup {state.result.setupFee.toLocaleString()} ₽
                                {state.result.addons.length > 0 &&
                                  ` + доп. ${state.result.addons.reduce((sum, a) => sum + a.price, 0).toLocaleString()} ₽`}
                                + первый месяц {state.result.monthly.toLocaleString()} ₽)
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Alternative Plans */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mb-8"
                        >
                          <div className="text-center text-sm text-white/60 mb-4">Также подойдут:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getAlternativePlans().map((plan, index) => (
                              <div
                                key={plan}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6"
                              >
                                <div className="font-bold text-lg mb-3">{getPlanName(plan).toUpperCase()}</div>
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Setup:</span>
                                    <span className="font-semibold">{PLANS[plan].setup.toLocaleString()} ₽</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Подписка:</span>
                                    <span className="font-semibold">{PLANS[plan].monthly.toLocaleString()} ₽/мес</span>
                                  </div>
                                </div>
                                <div className="text-xs text-white/50 mb-4">
                                  {plan === "lite" ? "Если бюджет ограничен" : "Если важна скорость и приоритет"}
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full rounded-full border-[#34C759] text-[#34C759] hover:bg-[#34C759]/10 bg-transparent"
                                >
                                  Выбрать {getPlanName(plan)}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Lead Form */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-4xl p-8"
                        >
                          <h3 className="text-xl font-bold mb-2 text-center">
                            Оставьте контакт — обсудим детали и ответим на вопросы
                          </h3>
                          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                            <div>
                              <input
                                type="text"
                                placeholder="Имя"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-[#34C759] focus:outline-none transition-all"
                              />
                            </div>
                            <div>
                              <input
                                type="tel"
                                placeholder="+7 (___) ___-__-__"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-[#34C759] focus:outline-none transition-all"
                              />
                            </div>
                            <div>
                              <input
                                type="email"
                                placeholder="Email (необязательно)"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-[#34C759] focus:outline-none transition-all"
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 text-white rounded-full py-6 text-lg"
                            >
                              Получить подробное предложение
                            </Button>
                            <p className="text-xs text-white/50 text-center">
                              Перезвоним в течение 30 минут в рабочее время
                            </p>
                          </form>
                        </motion.div>

                        <div className="text-center mt-6">
                          <button
                            onClick={resetCalculator}
                            className="text-sm text-white/60 hover:text-[#34C759] transition-colors underline"
                          >
                            Пересчитать с другими параметрами
                          </button>
                        </div>
                      </>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                          className="w-20 h-20 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <Check size={40} />
                        </motion.div>
                        <h3 className="text-3xl font-bold mb-3">Спасибо!</h3>
                        <p className="text-white/70 mb-2">Ваша заявка принята</p>
                        <p className="text-sm text-white/50 mb-8">Перезвоним в течение 30 минут</p>
                        <Button
                          onClick={() => (window.location.href = "/")}
                          className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 rounded-full"
                        >
                          Вернуться на главную
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Social Proof */}
          {state.step < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <div className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3">
                <p className="text-sm text-white/70">
                  Уже <span className="text-[#34C759] font-semibold">150+ компаний</span> рассчитали стоимость и
                  запустили сайт
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
