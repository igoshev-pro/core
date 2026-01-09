"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Clock, Eye, ChevronRight, TrendingUp, Tag, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", name: "Все статьи", color: "from-[#34C759] to-[#00C7BE]" },
  { id: "conversion", name: "Конверсия", color: "from-cyan-500 to-cyan-600" },
  { id: "seo", name: "SEO", color: "from-green-500 to-green-600" },
  { id: "design", name: "Дизайн", color: "from-purple-500 to-purple-600" },
  { id: "development", name: "Разработка", color: "from-orange-500 to-orange-600" },
  { id: "analytics", name: "Аналитика", color: "from-blue-500 to-blue-600" },
  { id: "cases", name: "Кейсы", color: "from-yellow-500 to-yellow-600" },
]

const featuredArticle = {
  slug: "kak-uvelichit-konversiyu-lendinga-2025",
  title: "Как увеличить конверсию лендинга в 2025 году: полное руководство",
  excerpt:
    "Разбираем 15 проверенных техник повышения конверсии с примерами и данными из наших проектов. Все методы протестированы на реальных клиентах.",
  category: "Конверсия",
  coverImage: "/blog/conversion-guide-2025.jpg",
  publishedAt: "15 января 2025",
  readingTime: 8,
  views: 2400,
}

const articles = [
  {
    slug: "10-oshibok-ubivaushchih-konversiyu",
    title: "10 ошибок, которые убивают конверсию вашего лендинга",
    excerpt: "Разбираем самые частые ошибки, которые мы видим в проектах клиентов и как их исправить за один день.",
    category: "Конверсия",
    coverImage: "/blog/conversion-mistakes.jpg",
    publishedAt: "12 января 2025",
    readingTime: 6,
    categoryColor: "from-cyan-500 to-cyan-600",
  },
  {
    slug: "seo-dlya-lendinga-checklist-2025",
    title: "SEO для лендинга: полный чек-лист на 2025 год",
    excerpt: "Пошаговое руководство по SEO-оптимизации посадочных страниц с примерами и инструментами.",
    category: "SEO",
    coverImage: "/blog/seo-checklist.jpg",
    publishedAt: "10 января 2025",
    readingTime: 10,
    categoryColor: "from-green-500 to-green-600",
  },
  {
    slug: "trendy-veb-dizayna-2025",
    title: "Тренды веб-дизайна 2025: что будет актуально",
    excerpt: "Анализируем главные тренды в дизайне сайтов и лендингов на основе 500+ проектов.",
    category: "Дизайн",
    coverImage: "/blog/design-trends-2025.jpg",
    publishedAt: "8 января 2025",
    readingTime: 7,
    categoryColor: "from-purple-500 to-purple-600",
  },
  {
    slug: "tilda-vs-zakaznaya-razrabotka",
    title: "Tilda vs заказная разработка: что выбрать для бизнеса",
    excerpt: "Честное сравнение конструктора и разработки с цифрами, примерами и рекомендациями.",
    category: "Разработка",
    coverImage: "/blog/tilda-vs-custom.jpg",
    publishedAt: "5 января 2025",
    readingTime: 9,
    categoryColor: "from-orange-500 to-orange-600",
  },
  {
    slug: "nastroyka-yandex-metriki",
    title: "Настройка Яндекс.Метрики для лендинга: пошаговая инструкция",
    excerpt: "Как правильно настроить аналитику, чтобы видеть реальную эффективность сайта.",
    category: "Аналитика",
    coverImage: "/blog/yandex-metrika-setup.jpg",
    publishedAt: "3 января 2025",
    readingTime: 5,
    categoryColor: "from-blue-500 to-blue-600",
  },
  {
    slug: "keys-stomatologiya-292-procenta",
    title: "Кейс: Как мы увеличили заявки стоматологии на 292%",
    excerpt: "Разбор реального проекта с цифрами, скриншотами и объяснением каждого шага.",
    category: "Кейсы",
    coverImage: "/blog/case-dental-292.jpg",
    publishedAt: "1 января 2025",
    readingTime: 12,
    categoryColor: "from-yellow-500 to-yellow-600",
  },
]

const popularPosts = [
  "Как увеличить конверсию лендинга в 2025",
  "10 ошибок, убивающих конверсию",
  "SEO для лендинга: полный чек-лист",
  "Tilda vs заказная разработка",
  "Кейс: +292% заявок для стоматологии",
]

const categoriesWithCount = [
  { name: "Конверсия", count: 23, slug: "conversion" },
  { name: "SEO", count: 18, slug: "seo" },
  { name: "Дизайн", count: 15, slug: "design" },
  { name: "Разработка", count: 12, slug: "development" },
  { name: "Аналитика", count: 9, slug: "analytics" },
  { name: "Кейсы", count: 8, slug: "cases" },
]

export default function BlogClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#34C759]/20 rounded-full blur-[128px] animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#00C7BE]/20 rounded-full blur-[128px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent"
            >
              WebConveyor
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm hover:text-[#34C759] transition-colors">
                Главная
              </Link>
              <Link href="/blog" className="text-sm text-[#34C759]">
                Блог
              </Link>
              <Link href="/tarify" className="text-sm hover:text-[#34C759] transition-colors">
                Тарифы
              </Link>
              <Button className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90">
                Начать проект
              </Button>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Блог</span>
          </nav>

          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Блог о создании сайтов</h1>
            <p className="text-xl text-white/70 mb-8 max-w-3xl text-pretty">
              Практические статьи о разработке, продвижении и конверсии. Без воды — только то, что работает.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Поиск по статьям..."
                className="w-full py-4 pl-12 pr-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 focus:border-[#34C759]/50 focus:outline-none transition-all"
              />
            </div>

            <p className="text-sm text-white/50">150+ статей • Обновляем каждую неделю</p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div>
              {/* Featured Article */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <Link href={`/blog/${featuredArticle.slug}`}>
                  <div className="group relative rounded-4xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all duration-500">
                    <div className="aspect-[21/9] relative overflow-hidden">
                      <Image
                        src={featuredArticle.coverImage || "/placeholder.svg"}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-medium">
                          {featuredArticle.category}
                        </span>
                        <span className="flex items-center gap-1 text-white/60">
                          <Clock className="w-4 h-4" />
                          {featuredArticle.readingTime} мин чтения
                        </span>
                        <span className="flex items-center gap-1 text-white/60">
                          <Eye className="w-4 h-4" />
                          {featuredArticle.views.toLocaleString()}
                        </span>
                      </div>

                      <h2 className="text-3xl font-bold mb-3 text-balance group-hover:text-[#34C759] transition-colors">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-white/70 mb-4 text-pretty">{featuredArticle.excerpt}</p>

                      <div className="flex items-center gap-2 text-[#34C759] font-medium">
                        Читать статью
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Category Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 overflow-x-auto pb-2"
              >
                <div className="flex gap-3 min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        category.id === "all"
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-[#34C759]/20`
                          : "bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 text-white/70 hover:text-white"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Articles Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link href={`/blog/${article.slug}`}>
                      <div className="group h-full rounded-4xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all duration-500">
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={article.coverImage || "/placeholder.svg"}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full bg-gradient-to-r ${article.categoryColor} text-white text-xs font-medium`}
                            >
                              {article.category}
                            </span>
                            <span className="flex items-center gap-1 text-white/60">
                              <Clock className="w-3 h-3" />
                              {article.readingTime} мин
                            </span>
                          </div>

                          <h3 className="text-xl font-bold mb-2 text-balance group-hover:text-[#34C759] transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-white/60 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                          <p className="text-xs text-white/40">{article.publishedAt}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex justify-center items-center gap-2"
              >
                <button className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all text-sm">
                  ← Назад
                </button>
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white font-medium">
                  1
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all">
                  2
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all">
                  3
                </button>
                <span className="text-white/40">...</span>
                <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all">
                  12
                </button>
                <button className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all text-sm">
                  Вперёд →
                </button>
              </motion.div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Popular Posts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-6"
              >
                <div className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#34C759]" />
                    <h3 className="font-bold">Популярное</h3>
                  </div>
                  <ul className="space-y-3">
                    {popularPosts.map((post, index) => (
                      <li key={index}>
                        <Link href="#" className="flex items-start gap-3 group">
                          <span className="text-[#34C759] font-bold text-sm">{index + 1}.</span>
                          <span className="text-sm text-white/70 group-hover:text-white transition-colors">{post}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Categories */}
                <div className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-[#34C759]" />
                    <h3 className="font-bold">Категории</h3>
                  </div>
                  <ul className="space-y-2">
                    {categoriesWithCount.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/blog/category/${cat.slug}`}
                          className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-sm group-hover:text-[#34C759] transition-colors">{cat.name}</span>
                          <span className="text-xs text-white/40">({cat.count})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="rounded-4xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-[#34C759]" />
                    <h3 className="font-bold">Подписка</h3>
                  </div>
                  <p className="text-sm text-white/70 mb-4">Получайте лучшие статьи на почту</p>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-3 py-2 px-4 rounded-full bg-white/5 border border-white/10 focus:border-[#34C759]/50 focus:outline-none transition-all text-sm"
                  />
                  <Button className="w-full rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90">
                    Подписаться
                  </Button>
                  <p className="text-xs text-white/40 mt-3 text-center">Без спама, раз в неделю</p>
                </div>

                {/* CTA */}
                <div className="rounded-4xl bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 backdrop-blur-xl border border-[#34C759]/30 p-6">
                  <p className="text-2xl mb-2">💬</p>
                  <h3 className="font-bold mb-2">Нужен сайт?</h3>
                  <p className="text-sm text-white/70 mb-4">Запустим за 7 дней с гарантией</p>
                  <Link href="/calculator">
                    <Button className="w-full rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90">
                      Рассчитать цену →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-24 py-12 backdrop-blur-xl bg-black/20">
          <div className="container mx-auto px-4 text-center text-white/60 text-sm">
            <p>© 2025 WebConveyor. Все права защищены.</p>
          </div>
        </footer>
      </div>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Блог WebConveyor",
            description: "Статьи о создании сайтов для бизнеса",
            url: "https://webconveyor.ru/blog",
            publisher: {
              "@type": "Organization",
              name: "WebConveyor",
              logo: "https://webconveyor.ru/logo.png",
            },
          }),
        }}
      />
    </div>
  )
}
