"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle,
  FileText,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import confetti from "canvas-confetti"

type BusinessType = "dental" | "legal" | "beauty" | "auto" | "construction" | "education" | "b2b" | "other"
type SiteStatus = "no_site" | "exists_not_working" | "outdated" | "additional"
type Goal = "get_leads" | "online_booking" | "portfolio" | "info" | "ecommerce"
type BillingPeriod = "monthly" | "3months" | "12months"

interface FormData {
  // Section 1
  businessType: BusinessType | ""
  businessTypeOther: string
  businessAge: string
  monthlyClients: string

  // Section 2
  siteStatus: SiteStatus | ""
  currentProblems: string[]
  currentSiteUrl: string
  otherProblem: string

  // Section 3
  goal: Goal | ""
  features: string[]

  // Section 4
  contentReady: string[]
  contentHelp: string
  timeline: string
  event: string
  priority: string

  // Section 5
  budget: string
  decisionMaker: string
  decisionTimeline: string
  name: string
  company: string
  phone: string
  email: string
  telegram: string
  notes: string
  wantExamples: boolean
  openToCall: boolean
}

const PLANS = {
  lite: { name: "LITE", setup: 9900, monthly: 1490 },
  standard: { name: "STANDARD", setup: 19900, monthly: 2490 },
  pro: { name: "PRO", setup: 34900, monthly: 3990 },
}

function recommendPlan(formData: FormData): "lite" | "standard" | "pro" {
  let score = 0

  if (formData.features.includes("crm")) score += 2
  if (formData.features.includes("ab_testing")) score += 3
  if (formData.features.includes("quiz")) score += 3
  if (formData.features.includes("blog")) score += 2
  if (formData.monthlyClients === "100+") score += 2
  if (formData.budget === "50-100k" || formData.budget === "100k+") score += 2

  if (score >= 5) return "pro"
  if (score >= 2) return "standard"
  return "lite"
}

function calculateEstimate(formData: FormData) {
  const plan = recommendPlan(formData)
  let setup = PLANS[plan].setup
  let addons = 0

  if (formData.features.includes("yclients")) addons += 15000
  if (formData.contentHelp === "texts") addons += 15000
  if (formData.contentHelp === "full") addons += 25000

  if (formData.timeline === "urgent") setup = Math.round(setup * 1.5)
  if (formData.timeline === "flexible") setup = Math.round(setup * 0.9)

  return { plan, setup, monthly: PLANS[plan].monthly, addons }
}

export default function BriefPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [applicationId] = useState(() => `brief_${Math.floor(1000 + Math.random() * 9000)}`)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["pages", "integrations"])

  const [formData, setFormData] = useState<FormData>({
    businessType: "",
    businessTypeOther: "",
    businessAge: "",
    monthlyClients: "",
    siteStatus: "",
    currentProblems: [],
    currentSiteUrl: "",
    otherProblem: "",
    goal: "",
    features: ["mobile", "forms", "notifications"],
    contentReady: [],
    contentHelp: "",
    timeline: "",
    event: "",
    priority: "",
    budget: "",
    decisionMaker: "",
    decisionTimeline: "",
    name: "",
    company: "",
    phone: "",
    email: "",
    telegram: "",
    notes: "",
    wantExamples: true,
    openToCall: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem("webconveyor_brief")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const shouldResume = window.confirm("Продолжить с того места, где остановились?")
        if (shouldResume) {
          setFormData(parsed.formData)
          setCurrentStep(parsed.currentStep)
        } else {
          localStorage.removeItem("webconveyor_brief")
        }
      } catch (e) {
        console.error("Failed to parse saved data")
      }
    }
  }, [])

  useEffect(() => {
    if (currentStep > 0 && !showResults) {
      localStorage.setItem("webconveyor_brief", JSON.stringify({ formData, currentStep }))
    }
  }, [formData, currentStep, showResults])

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter((v) => v !== value)
        : [...(prev[field] as string[]), value],
    }))
  }

  const getStepSection = (step: number): number => {
    if (step <= 1) return 0
    if (step <= 3) return 1
    if (step <= 5) return 2
    if (step <= 7) return 3
    return 4
  }

  const getSectionProgress = () => {
    const section = getStepSection(currentStep)
    return ((section + 1) / 5) * 100
  }

  const getSectionLabel = () => {
    const section = getStepSection(currentStep)
    const labels = ["БИЗНЕС", "САЙТ", "ФУНКЦИИ", "ДЕТАЛИ", "КОНТАКТ"]
    return labels[section]
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true
      case 1:
        return formData.businessType !== ""
      case 2:
        return formData.businessAge !== "" && formData.monthlyClients !== ""
      case 3:
        return formData.siteStatus !== ""
      case 4:
        return true
      case 5:
        return formData.goal !== ""
      case 6:
        return true
      case 7:
        return formData.contentHelp !== ""
      case 8:
        return formData.timeline !== "" && formData.priority !== ""
      case 9:
        return formData.budget !== "" && formData.decisionMaker !== ""
      case 10:
        return formData.name !== "" && formData.phone !== "" && formData.email !== ""
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep === 3 && formData.siteStatus === "no_site") {
      setCurrentStep(5)
    } else if (currentStep === 10) {
      handleSubmit()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep === 5 && formData.siteStatus === "no_site") {
      setCurrentStep(3)
    } else {
      setCurrentStep((prev) => Math.max(0, prev - 1))
    }
  }

  const handleSubmit = () => {
    console.log("[v0] Brief submitted:", { applicationId, formData })

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    setShowResults(true)
    localStorage.removeItem("webconveyor_brief")
  }

  const estimate = calculateEstimate(formData)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#34C759]/20 via-[#00C7BE]/20 to-[#34C759]/10 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
      </div>

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {currentStep === 0 ? (
                  <HeroStep onStart={() => setCurrentStep(1)} />
                ) : (
                  <>
                    <ProgressBar progress={getSectionProgress()} label={getSectionLabel()} step={currentStep} />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8"
                      >
                        {currentStep === 1 && (
                          <Step1BusinessType
                            value={formData.businessType}
                            otherValue={formData.businessTypeOther}
                            onChange={(val) => updateField("businessType", val)}
                            onOtherChange={(val) => updateField("businessTypeOther", val)}
                          />
                        )}
                        {currentStep === 2 && (
                          <Step2BusinessDetails
                            age={formData.businessAge}
                            clients={formData.monthlyClients}
                            onAgeChange={(val) => updateField("businessAge", val)}
                            onClientsChange={(val) => updateField("monthlyClients", val)}
                          />
                        )}
                        {currentStep === 3 && (
                          <Step3SiteStatus
                            value={formData.siteStatus}
                            onChange={(val) => updateField("siteStatus", val)}
                          />
                        )}
                        {currentStep === 4 && (
                          <Step4CurrentProblems
                            problems={formData.currentProblems}
                            url={formData.currentSiteUrl}
                            other={formData.otherProblem}
                            onProblemsChange={(val) => toggleArrayField("currentProblems", val)}
                            onUrlChange={(val) => updateField("currentSiteUrl", val)}
                            onOtherChange={(val) => updateField("otherProblem", val)}
                          />
                        )}
                        {currentStep === 5 && (
                          <Step5Goals value={formData.goal} onChange={(val) => updateField("goal", val)} />
                        )}
                        {currentStep === 6 && (
                          <Step6Features
                            features={formData.features}
                            onToggle={(val) => toggleArrayField("features", val)}
                            expandedGroups={expandedGroups}
                            onToggleGroup={(group) => {
                              setExpandedGroups((prev) =>
                                prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
                              )
                            }}
                          />
                        )}
                        {currentStep === 7 && (
                          <Step7Content
                            contentReady={formData.contentReady}
                            contentHelp={formData.contentHelp}
                            onToggleReady={(val) => toggleArrayField("contentReady", val)}
                            onHelpChange={(val) => updateField("contentHelp", val)}
                          />
                        )}
                        {currentStep === 8 && (
                          <Step8Timeline
                            timeline={formData.timeline}
                            event={formData.event}
                            priority={formData.priority}
                            onTimelineChange={(val) => updateField("timeline", val)}
                            onEventChange={(val) => updateField("event", val)}
                            onPriorityChange={(val) => updateField("priority", val)}
                          />
                        )}
                        {currentStep === 9 && (
                          <Step9Budget
                            budget={formData.budget}
                            decisionMaker={formData.decisionMaker}
                            decisionTimeline={formData.decisionTimeline}
                            onBudgetChange={(val) => updateField("budget", val)}
                            onDecisionMakerChange={(val) => updateField("decisionMaker", val)}
                            onDecisionTimelineChange={(val) => updateField("decisionTimeline", val)}
                          />
                        )}
                        {currentStep === 10 && <Step10Contact formData={formData} onChange={updateField} />}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-8 gap-4">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="rounded-full border-white/20 hover:bg-white/10 bg-transparent"
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Назад
                      </Button>

                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90 disabled:opacity-50"
                      >
                        {currentStep === 10 ? "Получить предложение" : "Далее"}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <ResultsScreen applicationId={applicationId} formData={formData} estimate={estimate} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function HeroStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
      <div className="mb-8 inline-block">
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <FileText size={64} className="text-[#34C759]" />
        </motion.div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Получите персональное предложение за 5 минут</h1>

      <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto text-pretty">
        Ответьте на вопросы — подготовим индивидуальный расчёт и план запуска без созвона
      </p>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 mb-8 max-w-xl mx-auto">
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <Check className="text-[#34C759] mt-1 flex-shrink-0" size={20} />
            <span>Узнаете точную стоимость</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="text-[#34C759] mt-1 flex-shrink-0" size={20} />
            <span>Получите примеры из вашей ниши</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="text-[#34C759] mt-1 flex-shrink-0" size={20} />
            <span>Сможем начать работу сразу</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90 text-lg px-8"
      >
        Начать
        <ArrowRight size={20} className="ml-2" />
      </Button>

      <p className="text-sm text-white/50 mt-4">Обычно занимает 3-5 минут • Ваши данные защищены</p>
    </motion.div>
  )
}

function ProgressBar({ progress, label, step }: { progress: number; label: string; step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/70">{label}</span>
        <span className="text-sm font-medium text-white/70">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#34C759] to-[#00C7BE]"
        />
      </div>
      <div className="text-xs text-white/50 mt-1">Шаг {step} из 10</div>
    </div>
  )
}

function Step1BusinessType({
  value,
  otherValue,
  onChange,
  onOtherChange,
}: {
  value: string
  otherValue: string
  onChange: (val: BusinessType) => void
  onOtherChange: (val: string) => void
}) {
  const businesses = [
    { id: "dental" as BusinessType, icon: "🦷", label: "Стоматология/Медицина" },
    { id: "legal" as BusinessType, icon: "⚖️", label: "Юридические услуги" },
    { id: "beauty" as BusinessType, icon: "💇", label: "Салон красоты/СПА" },
    { id: "auto" as BusinessType, icon: "🔧", label: "Автосервис/Авто" },
    { id: "construction" as BusinessType, icon: "🏠", label: "Ремонт/Строительство" },
    { id: "education" as BusinessType, icon: "📚", label: "Образование/Курсы" },
    { id: "b2b" as BusinessType, icon: "🏪", label: "Услуги для бизнеса (B2B)" },
    { id: "other" as BusinessType, icon: "📦", label: "Другое" },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Расскажите о вашем бизнесе</h2>
      <p className="text-white/70 mb-6">Какая у вас сфера деятельности?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map((business) => (
          <motion.button
            key={business.id}
            onClick={() => onChange(business.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-4xl bg-white/5 backdrop-blur-xl border transition-all text-left ${
              value === business.id
                ? "border-[#34C759] shadow-[0_0_30px_rgba(52,199,89,0.3)]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-3xl mb-2">{business.icon}</div>
            <div className="font-medium">{business.label}</div>
          </motion.button>
        ))}
      </div>

      {value === "other" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Опишите вашу сферу"
            className="w-full p-4 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors"
          />
        </motion.div>
      )}
    </div>
  )
}

function Step2BusinessDetails({
  age,
  clients,
  onAgeChange,
  onClientsChange,
}: {
  age: string
  clients: string
  onAgeChange: (val: string) => void
  onClientsChange: (val: string) => void
}) {
  const ageOptions = ["Только запускаемся", "Меньше года", "1-3 года", "3-5 лет", "Больше 5 лет"]

  const clientOptions = ["Пока нет клиентов", "До 20 клиентов", "20-50 клиентов", "50-100 клиентов", "Больше 100"]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Немного подробнее</h2>
      <p className="text-white/70 mb-6">Это поможет подобрать оптимальное решение</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Как давно работает бизнес?</h3>
          <div className="space-y-2">
            {ageOptions.map((option) => (
              <button
                key={option}
                onClick={() => onAgeChange(option)}
                className={`w-full p-3 rounded-full text-left transition-all ${
                  age === option
                    ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Сколько примерно клиентов обслуживаете в месяц?</h3>
          <div className="space-y-2">
            {clientOptions.map((option) => (
              <button
                key={option}
                onClick={() => onClientsChange(option)}
                className={`w-full p-3 rounded-full text-left transition-all ${
                  clients === option
                    ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step3SiteStatus({
  value,
  onChange,
}: {
  value: string
  onChange: (val: SiteStatus) => void
}) {
  const statuses = [
    {
      id: "no_site" as SiteStatus,
      icon: "🚫",
      label: "Сайта нет вообще",
      desc: "Работаем через соцсети, сарафан или офлайн",
    },
    {
      id: "exists_not_working" as SiteStatus,
      icon: "😤",
      label: "Есть сайт, но он не работает",
      desc: "Сайт есть, но заявок мало или нет совсем",
    },
    {
      id: "outdated" as SiteStatus,
      icon: "👴",
      label: "Есть сайт, но устарел",
      desc: "Дизайн старый, неудобный, стыдно показывать",
    },
    {
      id: "additional" as SiteStatus,
      icon: "➕",
      label: "Есть сайт, нужен дополнительный",
      desc: "Основной сайт есть, нужен лендинг под акцию/услугу",
    },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Что сейчас с сайтом?</h2>
      <p className="text-white/70 mb-6">Выберите вариант, который описывает вашу ситуацию</p>

      <div className="space-y-4">
        {statuses.map((status) => (
          <motion.button
            key={status.id}
            onClick={() => onChange(status.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full p-6 rounded-4xl bg-white/5 backdrop-blur-xl border transition-all text-left ${
              value === status.id
                ? "border-[#34C759] shadow-[0_0_30px_rgba(52,199,89,0.3)]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{status.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-lg mb-1">{status.label}</div>
                <div className="text-sm text-white/60">{status.desc}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function Step4CurrentProblems({
  problems,
  url,
  other,
  onProblemsChange,
  onUrlChange,
  onOtherChange,
}: {
  problems: string[]
  url: string
  other: string
  onProblemsChange: (val: string) => void
  onUrlChange: (val: string) => void
  onOtherChange: (val: string) => void
}) {
  const problemOptions = [
    "few_leads|Мало заявок или нет совсем",
    "outdated_design|Устаревший дизайн",
    "not_mobile|Плохо выглядит на телефоне",
    "slow|Медленно загружается",
    "hard_update|Сложно обновлять информацию",
    "no_booking|Нет онлайн-записи/форм",
    "no_seo|Не отображается в поиске (SEO)",
    "no_analytics|Нет аналитики, не понимаю что происходит",
    "contractor_gone|Подрядчик пропал/не отвечает",
    "other|Другое",
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Что не устраивает в текущем сайте?</h2>
      <p className="text-white/70 mb-6">Выберите всё, что актуально</p>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 mb-6">
        <div className="space-y-3">
          {problemOptions.map((option) => {
            const [id, label] = option.split("|")
            const isChecked = problems.includes(id)

            return (
              <button
                key={id}
                onClick={() => onProblemsChange(id)}
                className={`w-full p-4 rounded-full text-left flex items-center gap-3 transition-all ${
                  isChecked ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked ? "border-white bg-white/20" : "border-white/30"
                  }`}
                >
                  {isChecked && <Check size={14} />}
                </div>
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {problems.includes("other") && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
          <textarea
            value={other}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Опишите вашу проблему"
            rows={3}
            className="w-full p-4 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors resize-none"
          />
        </motion.div>
      )}

      <div>
        <label className="block text-sm text-white/70 mb-2">Ссылка на текущий сайт (если есть)</label>
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors"
        />
      </div>
    </div>
  )
}

function Step5Goals({
  value,
  onChange,
}: {
  value: string
  onChange: (val: Goal) => void
}) {
  const goals = [
    {
      id: "get_leads" as Goal,
      label: "Получать заявки и звонки",
      desc: "Лендинг или сайт-визитка для сбора лидов",
    },
    {
      id: "online_booking" as Goal,
      label: "Записывать клиентов онлайн",
      desc: "Нужен виджет записи (YCLIENTS и т.п.)",
    },
    {
      id: "portfolio" as Goal,
      label: "Показать портфолио/работы",
      desc: "Галерея проектов, кейсы, отзывы",
    },
    {
      id: "info" as Goal,
      label: "Информировать о компании",
      desc: "Представительский сайт с информацией",
    },
    {
      id: "ecommerce" as Goal,
      label: "Продавать товары",
      desc: "Каталог с корзиной и оплатой",
    },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Для чего вам нужен сайт?</h2>
      <p className="text-white/70 mb-6">Что должен делать сайт в первую очередь?</p>

      <div className="space-y-4">
        {goals.map((goal) => (
          <motion.button
            key={goal.id}
            onClick={() => onChange(goal.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full p-6 rounded-4xl bg-white/5 backdrop-blur-xl border transition-all text-left ${
              value === goal.id
                ? "border-[#34C759] shadow-[0_0_30px_rgba(52,199,89,0.3)]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="font-semibold text-lg mb-1">{goal.label}</div>
            <div className="text-sm text-white/60">{goal.desc}</div>
          </motion.button>
        ))}
      </div>

      {value === "ecommerce" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-4xl bg-amber-500/10 border border-amber-500/30"
        >
          <p className="text-sm text-amber-200">
            ⚠️ Мы специализируемся на сайтах услуг. Для интернет-магазина лучше подойдёт другое решение.
          </p>
        </motion.div>
      )}
    </div>
  )
}

function Step6Features({
  features,
  onToggle,
  expandedGroups,
  onToggleGroup,
}: {
  features: string[]
  onToggle: (val: string) => void
  expandedGroups: string[]
  onToggleGroup: (group: string) => void
}) {
  const featureGroups = {
    required: {
      label: "Обязательно (включено)",
      items: [
        { id: "mobile", label: "Адаптивный дизайн (мобильная версия)", locked: true },
        { id: "forms", label: "Формы захвата заявок", locked: true },
        { id: "notifications", label: "Уведомления о заявках", locked: true },
      ],
    },
    pages: {
      label: "Страницы и контент",
      items: [
        { id: "services_pages", label: "Страница каждой услуги", tag: "Standard+" },
        { id: "about", label: "Раздел 'О компании'" },
        { id: "team", label: "Раздел с командой/специалистами" },
        { id: "pricing", label: "Прайс-лист" },
        { id: "portfolio", label: "Портфолио/галерея работ" },
        { id: "reviews", label: "Отзывы клиентов" },
        { id: "blog", label: "Блог/новости", tag: "Pro" },
      ],
    },
    integrations: {
      label: "Интеграции",
      items: [
        { id: "crm", label: "CRM (amoCRM, Bitrix24)", tag: "Standard+", recommended: true },
        { id: "yclients", label: "Онлайн-запись (YCLIENTS)", tag: "+15 000₽" },
        { id: "yandex_metrika", label: "Яндекс.Метрика" },
        { id: "google_analytics", label: "Google Analytics", tag: "Standard+" },
        { id: "calltracking", label: "Коллтрекинг", tag: "Pro" },
      ],
    },
    advanced: {
      label: "Продвинутые",
      items: [
        { id: "quiz", label: "Квиз-форма", tag: "Pro" },
        { id: "ab_testing", label: "A/B тестирование", tag: "Pro" },
        { id: "multilandings", label: "Мультилендинги", tag: "Pro" },
        { id: "chat", label: "Чат на сайте", tag: "Add-on" },
      ],
    },
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Какие функции нужны?</h2>
      <p className="text-white/70 mb-6">Выберите всё, что важно для вашего сайта</p>

      <div className="space-y-4">
        {Object.entries(featureGroups).map(([groupId, group]) => {
          const isExpanded = expandedGroups.includes(groupId)

          return (
            <div
              key={groupId}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl overflow-hidden"
            >
              <button
                onClick={() => onToggleGroup(groupId)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold">{group.label}</span>
                {groupId !== "required" && (isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
              </button>

              <AnimatePresence>
                {(isExpanded || groupId === "required") && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-2">
                      {group.items.map((item) => {
                        const isChecked = features.includes(item.id)
                        const isLocked = "locked" in item && item.locked

                        return (
                          <button
                            key={item.id}
                            onClick={() => !isLocked && onToggle(item.id)}
                            disabled={isLocked}
                            className={`w-full p-3 rounded-full text-left flex items-center gap-3 transition-all ${
                              isChecked
                                ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                                : "bg-white/5 hover:bg-white/10"
                            } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                isChecked ? "border-white bg-white/20" : "border-white/30"
                              }`}
                            >
                              {isChecked && <Check size={14} />}
                            </div>
                            <span className="flex-1">{item.label}</span>
                            {"tag" in item && (
                              <span className="text-xs px-2 py-1 rounded-full bg-white/20">{item.tag}</span>
                            )}
                            {"recommended" in item && item.recommended && (
                              <span className="text-xs px-2 py-1 rounded-full bg-[#34C759]/30 text-[#34C759]">
                                Рекомендуем
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Step7Content({
  contentReady,
  contentHelp,
  onToggleReady,
  onHelpChange,
}: {
  contentReady: string[]
  contentHelp: string
  onToggleReady: (val: string) => void
  onHelpChange: (val: string) => void
}) {
  const readyItems = [
    "logo|Логотип (в хорошем качестве)",
    "texts|Тексты о компании и услугах",
    "photos|Фотографии (помещение, команда, работы)",
    "pricing|Прайс-лист / список услуг",
    "reviews|Отзывы клиентов",
    "team_info|Информация о сотрудниках",
  ]

  const helpOptions = [
    { id: "no", label: "Нет, всё подготовим сами", price: "" },
    { id: "texts", label: "Да, нужна помощь с текстами", price: "+15 000₽" },
    { id: "full", label: "Да, нужна помощь с текстами и фото", price: "от +25 000₽" },
    { id: "discuss", label: "Пока не знаю, обсудим", price: "" },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Контент для сайта</h2>
      <p className="text-white/70 mb-6">Что из материалов у вас уже есть?</p>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 mb-6">
        <div className="space-y-3">
          {readyItems.map((item) => {
            const [id, label] = item.split("|")
            const isChecked = contentReady.includes(id)

            return (
              <button
                key={id}
                onClick={() => onToggleReady(id)}
                className={`w-full p-3 rounded-full text-left flex items-center gap-3 transition-all ${
                  isChecked ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked ? "border-white bg-white/20" : "border-white/30"
                  }`}
                >
                  {isChecked && <Check size={14} />}
                </div>
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Нужна ли помощь с контентом?</h3>
        <div className="space-y-3">
          {helpOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onHelpChange(option.id)}
              className={`w-full p-4 rounded-4xl text-left transition-all ${
                contentHelp === option.id
                  ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {option.price && <span className="text-sm font-semibold">{option.price}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step8Timeline({
  timeline,
  event,
  priority,
  onTimelineChange,
  onEventChange,
  onPriorityChange,
}: {
  timeline: string
  event: string
  priority: string
  onTimelineChange: (val: string) => void
  onEventChange: (val: string) => void
  onPriorityChange: (val: string) => void
}) {
  const timelineOptions = [
    { id: "urgent", label: "Срочно — в течение недели", tag: "+50% к Setup", color: "text-red-400" },
    { id: "2weeks", label: "В течение 2 недель", tag: "Стандарт", color: "text-blue-400" },
    { id: "month", label: "В течение месяца", tag: "", color: "" },
    { id: "flexible", label: "Не срочно, планирую заранее", tag: "Скидка 10%", color: "text-green-400" },
  ]

  const eventOptions = [
    "ad_launch|Да, запуск рекламы",
    "business_launch|Да, открытие/запуск бизнеса",
    "season|Да, сезон/акция",
    "no_date|Нет конкретной даты",
  ]

  const priorityOptions = [
    "speed|Скорость запуска",
    "price|Цена",
    "quality|Качество и надёжность",
    "all|Всё важно одинаково",
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Сроки и приоритеты</h2>
      <p className="text-white/70 mb-6">Это поможет организовать работу оптимально</p>

      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Когда нужен готовый сайт?</h3>
          <div className="space-y-2">
            {timelineOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onTimelineChange(option.id)}
                className={`w-full p-3 rounded-full text-left flex items-center justify-between transition-all ${
                  timeline === option.id
                    ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <span>{option.label}</span>
                {option.tag && (
                  <span className={`text-xs px-2 py-1 rounded-full bg-white/20 ${option.color}`}>{option.tag}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Есть ли привязка к какому-то событию?</h3>
          <div className="space-y-2">
            {eventOptions.map((option) => {
              const [id, label] = option.split("|")
              return (
                <button
                  key={id}
                  onClick={() => onEventChange(id)}
                  className={`w-full p-3 rounded-full text-left transition-all ${
                    event === id
                      ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Что важнее всего?</h3>
          <div className="space-y-2">
            {priorityOptions.map((option) => {
              const [id, label] = option.split("|")
              return (
                <button
                  key={id}
                  onClick={() => onPriorityChange(id)}
                  className={`w-full p-3 rounded-full text-left transition-all ${
                    priority === id
                      ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step9Budget({
  budget,
  decisionMaker,
  decisionTimeline,
  onBudgetChange,
  onDecisionMakerChange,
  onDecisionTimelineChange,
}: {
  budget: string
  decisionMaker: string
  decisionTimeline: string
  onBudgetChange: (val: string) => void
  onDecisionMakerChange: (val: string) => void
  onDecisionTimelineChange: (val: string) => void
}) {
  const budgetOptions = [
    { id: "15k", label: "До 15 000 ₽", note: "Подойдёт тариф Lite или конструктор" },
    { id: "15-30k", label: "15 000 — 30 000 ₽", note: "Оптимально для Lite/Standard" },
    { id: "30-50k", label: "30 000 — 50 000 ₽", note: "Standard с дополнениями или Pro", popular: true },
    { id: "50-100k", label: "50 000 — 100 000 ₽", note: "Pro с полным набором функций" },
    { id: "100k+", label: "Больше 100 000 ₽", note: "Комплексное решение с контентом" },
    { id: "unsure", label: "Пока не определился", note: "Подберём варианты в разных ценовых категориях" },
  ]

  const decisionMakerOptions = [
    "self|Я принимаю решение единолично",
    "partner|Нужно согласовать с партнёром/директором",
    "management|Решение принимает руководство (я собираю информацию)",
  ]

  const decisionTimelineOptions = [
    "now|Готов начать сразу, если всё устроит",
    "week|В течение недели",
    "month|В течение месяца",
    "research|Пока только собираю информацию",
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Бюджет и принятие решения</h2>
      <p className="text-white/70 mb-6">Это поможет предложить оптимальный вариант</p>

      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Какой бюджет закладываете?</h3>
          <div className="space-y-3">
            {budgetOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onBudgetChange(option.id)}
                className={`w-full p-4 rounded-4xl text-left transition-all ${
                  budget === option.id
                    ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{option.label}</span>
                  {option.popular && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20">Популярный выбор</span>
                  )}
                </div>
                <div className="text-sm text-white/60">{option.note}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Кто принимает решение о заказе?</h3>
          <div className="space-y-2">
            {decisionMakerOptions.map((option) => {
              const [id, label] = option.split("|")
              return (
                <button
                  key={id}
                  onClick={() => onDecisionMakerChange(id)}
                  className={`w-full p-3 rounded-full text-left transition-all ${
                    decisionMaker === id
                      ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6">
          <h3 className="font-semibold mb-4">Как скоро готовы принять решение?</h3>
          <div className="space-y-2">
            {decisionTimelineOptions.map((option) => {
              const [id, label] = option.split("|")
              return (
                <button
                  key={id}
                  onClick={() => onDecisionTimelineChange(id)}
                  className={`w-full p-3 rounded-full text-left transition-all ${
                    decisionTimeline === id
                      ? "bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step10Contact({
  formData,
  onChange,
}: {
  formData: FormData
  onChange: (field: keyof FormData, value: any) => void
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Почти готово! Куда отправить предложение?</h2>
      <p className="text-white/70 mb-6">Подготовим персональный расчёт и примеры из вашей ниши</p>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 space-y-4">
        <div>
          <label className="block text-sm mb-2">Ваше имя *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Иван"
            className="w-full p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Название компании</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => onChange("company", e.target.value)}
            placeholder="ООО 'Название'"
            className="w-full p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Телефон *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className="w-full p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="ivan@example.com"
            className="w-full p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">
            Telegram/WhatsApp
            <span className="text-white/50 ml-2 text-xs">Удобнее для быстрой связи</span>
          </label>
          <input
            type="text"
            value={formData.telegram}
            onChange={(e) => onChange("telegram", e.target.value)}
            placeholder="@username или +7 999 123-45-67"
            className="w-full p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Есть что-то важное, что мы не спросили?</label>
          <textarea
            value={formData.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Дополнительные пожелания, вопросы, ссылки на референсы..."
            rows={4}
            className="w-full p-4 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/20 focus:border-[#34C759] outline-none transition-colors resize-none"
          />
        </div>

        <div className="space-y-3 pt-4">
          <button onClick={() => onChange("wantExamples", !formData.wantExamples)} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                formData.wantExamples ? "border-[#34C759] bg-[#34C759]" : "border-white/30"
              }`}
            >
              {formData.wantExamples && <Check size={14} />}
            </div>
            <span className="text-sm">Хочу получить примеры сайтов из моей ниши</span>
          </button>

          <button onClick={() => onChange("openToCall", !formData.openToCall)} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                formData.openToCall ? "border-[#34C759] bg-[#34C759]" : "border-white/30"
              }`}
            >
              {formData.openToCall && <Check size={14} />}
            </div>
            <span className="text-sm">Готов к короткому звонку для уточнения деталей</span>
          </button>
        </div>

        <p className="text-xs text-white/50 pt-4">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
      </div>
    </div>
  )
}

function ResultsScreen({
  applicationId,
  formData,
  estimate,
}: {
  applicationId: string
  formData: FormData
  estimate: ReturnType<typeof calculateEstimate>
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-block mb-4"
        >
          <CheckCircle size={64} className="text-[#34C759]" />
        </motion.div>

        <h1 className="text-4xl font-bold mb-2">Спасибо, {formData.name}!</h1>
        <p className="text-white/70">Ваша заявка #{applicationId} принята</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 mb-6">
        <h2 className="text-xl font-semibold mb-6">Что дальше:</h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="text-2xl">📋</div>
            <div>
              <div className="font-medium mb-1">Изучим вашу анкету (уже делаем!)</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-2xl">📊</div>
            <div>
              <div className="font-medium mb-1">Подготовим персональное предложение</div>
              <ul className="text-sm text-white/70 space-y-1 ml-4 list-disc">
                <li>Рекомендуемый тариф и стоимость</li>
                <li>Примеры сайтов из вашей ниши</li>
                <li>План запуска с датами</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-2xl">📧</div>
            <div>
              <div className="font-medium mb-1">Отправим на {formData.email} в течение 2 часов</div>
              <div className="text-sm text-white/70">(в рабочее время)</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-2xl">📞</div>
            <div>
              <div className="font-medium">Позвоним для уточнения, если потребуется</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">Предварительная оценка на основе ваших ответов:</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white/5 rounded-4xl p-4 text-center">
            <div className="text-sm text-white/70 mb-1">Рекомендуемый тариф</div>
            <div className="text-2xl font-bold text-[#34C759]">{PLANS[estimate.plan].name}</div>
          </div>

          <div className="bg-white/5 rounded-4xl p-4 text-center">
            <div className="text-sm text-white/70 mb-1">Ориентировочная стоимость</div>
            <div className="text-2xl font-bold">от {(estimate.setup + estimate.addons).toLocaleString()} ₽</div>
          </div>

          <div className="bg-white/5 rounded-4xl p-4 text-center">
            <div className="text-sm text-white/70 mb-1">Срок запуска</div>
            <div className="text-2xl font-bold">7-10 дней</div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-4xl p-4 text-sm text-amber-200">
          ⚠️ Финальное предложение пришлём после анализа
        </div>
      </div>

      <div className="text-center">
        <p className="text-white/70 mb-4">А пока можете:</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = "/cases")}
            variant="outline"
            className="rounded-full border-white/20 hover:bg-white/10"
          >
            Посмотреть кейсы
            <ArrowRight size={16} className="ml-2" />
          </Button>
          <Button
            onClick={() => window.open("https://t.me/webconveyor", "_blank")}
            className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90"
          >
            Написать в Telegram
            <MessageCircle size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
