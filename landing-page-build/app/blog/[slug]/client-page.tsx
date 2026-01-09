"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Clock, Eye, Share2, Copy, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MDXContent } from "@/components/blog/mdx-content"
import { TableOfContents } from "@/components/blog/table-of-contents"

// This would come from your CMS or markdown files
const article = {
  slug: "kak-uvelichit-konversiyu-lendinga-2025",
  title: "Как увеличить конверсию лендинга в 2025 году: полное руководство",
  excerpt:
    "Разбираем 15 проверенных техник повышения конверсии с примерами и данными из наших проектов. Все методы протестированы на реальных клиентах.",
  content: `
## Введение

Конверсия — это ключевой показатель эффективности любого лендинга. В этой статье мы разберём 15 проверенных техник, которые помогли нашим клиентам увеличить конверсию от 50% до 300%.

## 1. Почему конверсия падает

Основные причины низкой конверсии:
- Нечёткое УТП
- Сложные формы
- Медленная загрузка
- Отсутствие доверия

### 1.1 Проблема нечёткого УТП

Если посетитель не понимает за 3 секунды, что вы предлагаете и почему это для него выгодно — он уходит...
  `,
  category: {
    name: "Конверсия",
    slug: "conversion",
    color: "from-cyan-500 to-cyan-600",
  },
  coverImage: "/blog/conversion-guide-2025.jpg",
  publishedAt: "2025-01-15T10:00:00+03:00",
  updatedAt: "2025-01-16T14:00:00+03:00",
  readingTime: 8,
  views: 2400,
  author: {
    name: "Иван Петров",
    role: "Основатель WebConveyor",
    bio: "Запустил 150+ сайтов за 3 года. Пишу о том, что реально работает в веб-разработке.",
    avatar: "/team/ivan-petrov.jpg",
    telegram: "@ivanpetrov",
  },
  tags: ["конверсия", "лендинг", "оптимизация", "CRO"],
}

const relatedArticles = [
  {
    slug: "10-oshibok-ubivaushchih-konversiyu",
    title: "10 ошибок, которые убивают конверсию",
    coverImage: "/blog/conversion-mistakes.jpg",
    category: "Конверсия",
  },
  {
    slug: "ab-testy-chto-testirovat",
    title: "A/B тесты: что тестировать в первую очередь",
    coverImage: "/blog/ab-tests.jpg",
    category: "Конверсия",
  },
  {
    slug: "seo-dlya-lendinga-checklist-2025",
    title: "SEO для лендинга: полный чек-лист",
    coverImage: "/blog/seo-checklist.jpg",
    category: "SEO",
  },
]

export default function ArticlePageClient() {
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
              <Link href="/blog" className="text-sm hover:text-[#34C759] transition-colors">
                Блог
              </Link>
              <Button className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90 text-sm">
                Начать проект
              </Button>
            </nav>
          </div>
        </header>

        <article className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Блог
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/blog/category/${article.category.slug}`} className="hover:text-white transition-colors">
              {article.category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate">{article.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[250px_1fr_250px] gap-8">
            {/* Left Sidebar - Share buttons (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="flex flex-col gap-3">
                  <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all flex items-center justify-center group">
                    <Share2 className="w-5 h-5 group-hover:text-[#34C759] transition-colors" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all flex items-center justify-center group">
                    <Copy className="w-5 h-5 group-hover:text-[#34C759] transition-colors" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto">
              {/* Article Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <span
                  className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${article.category.color} text-white text-sm font-medium mb-4`}
                >
                  {article.category.name}
                </span>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-8">
                  <span>📅 15 января 2025</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readingTime} мин чтения
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views.toLocaleString()} просмотров
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 p-4 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8">
                  <Image
                    src={article.author.avatar || "/placeholder.svg"}
                    alt={article.author.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{article.author.name}</p>
                    <p className="text-sm text-white/60">{article.author.role}</p>
                    <p className="text-sm text-white/50 italic mt-1">"{article.author.bio}"</p>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="rounded-4xl overflow-hidden border border-white/10 mb-12">
                  <Image
                    src={article.coverImage || "/placeholder.svg"}
                    alt={article.title}
                    width={1200}
                    height={630}
                    className="w-full"
                  />
                </div>
              </motion.div>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-invert prose-lg max-w-none mb-16"
              >
                <MDXContent content={article.content} />
              </motion.div>

              {/* Article Footer */}
              <div className="space-y-8 mb-16">
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-3 py-6 border-t border-white/10">
                  <span className="text-sm text-white/60">🏷 Теги:</span>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#34C759]/50 transition-all text-sm"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* Author Bio */}
                <div className="p-6 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">Об авторе</h3>
                  <div className="flex items-start gap-4">
                    <Image
                      src={article.author.avatar || "/placeholder.svg"}
                      alt={article.author.name}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-xl mb-1">{article.author.name}</h4>
                      <p className="text-white/60 mb-3">{article.author.role}</p>
                      <p className="text-white/70 mb-4">{article.author.bio}</p>
                      <div className="flex gap-3">
                        <Link href={`https://t.me/${article.author.telegram}`}>
                          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                            Telegram
                          </Button>
                        </Link>
                        <Link href="/blog">
                          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                            Все статьи автора →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="flex items-center justify-between py-6 border-y border-white/10">
                  <span className="text-sm text-white/60">Поделиться статьёй:</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#34C759]/50 transition-all text-sm">
                      Telegram
                    </button>
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#34C759]/50 transition-all text-sm">
                      VK
                    </button>
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#34C759]/50 transition-all text-sm">
                      Копировать
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="text-center py-6">
                  <p className="text-sm text-white/60 mb-4">Оцените статью:</p>
                  <div className="flex justify-center gap-4 text-3xl">
                    <button className="hover:scale-110 transition-transform">😞</button>
                    <button className="hover:scale-110 transition-transform">😐</button>
                    <button className="hover:scale-110 transition-transform">🙂</button>
                    <button className="hover:scale-110 transition-transform">😀</button>
                    <button className="hover:scale-110 transition-transform">🤩</button>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8">Читайте также</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link key={related.slug} href={`/blog/${related.slug}`}>
                      <div className="group rounded-4xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all">
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={related.coverImage || "/placeholder.svg"}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-white/60 mb-2">{related.category}</p>
                          <h3 className="font-semibold group-hover:text-[#34C759] transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Next/Prev Navigation */}
              <div className="grid md:grid-cols-2 gap-6 mb-16">
                <Link href="/blog/previous-article">
                  <div className="group p-6 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all h-full">
                    <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Предыдущая статья</span>
                    </div>
                    <h3 className="font-semibold group-hover:text-[#34C759] transition-colors">
                      10 ошибок, которые убивают конверсию
                    </h3>
                  </div>
                </Link>
                <Link href="/blog/next-article">
                  <div className="group p-6 rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#34C759]/50 transition-all h-full text-right">
                    <div className="flex items-center justify-end gap-2 text-sm text-white/60 mb-2">
                      <span>Следующая статья</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold group-hover:text-[#34C759] transition-colors">
                      A/B тесты: что тестировать в первую очередь
                    </h3>
                  </div>
                </Link>
              </div>

              {/* Bottom CTA */}
              <div className="p-8 rounded-4xl bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 backdrop-blur-xl border border-[#34C759]/30 text-center">
                <h2 className="text-3xl font-bold mb-4">Понравилась статья?</h2>
                <p className="text-white/70 mb-6">Получите бесплатный аудит вашего сайта от автора</p>
                <Link href="/audit">
                  <Button className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90 px-8 mb-6">
                    Записаться на аудит →
                  </Button>
                </Link>
                <p className="text-sm text-white/60 mb-4">или</p>
                <p className="text-white/70 mb-4">Подпишитесь на рассылку — присылаем лучшие статьи раз в неделю</p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 py-2 px-4 rounded-full bg-white/5 border border-white/10 focus:border-[#34C759]/50 focus:outline-none transition-all"
                  />
                  <Button className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:opacity-90">
                    Подписаться
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Table of Contents */}
            <TableOfContents />
          </div>
        </article>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 backdrop-blur-xl bg-black/20">
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
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: `https://webconveyor.ru${article.coverImage}`,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: {
              "@type": "Person",
              name: article.author.name,
            },
            publisher: {
              "@type": "Organization",
              name: "WebConveyor",
              logo: {
                "@type": "ImageObject",
                url: "https://webconveyor.ru/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://webconveyor.ru/blog/${article.slug}`,
            },
            articleSection: article.category.name,
            wordCount: 2500,
            timeRequired: `PT${article.readingTime}M`,
          }),
        }}
      />
    </div>
  )
}
