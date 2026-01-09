import type { Metadata } from "next"
import ArticlePageClient from "./client-page"

// This would come from your CMS or markdown files
const article = {
  slug: "kak-uvelichit-konversiyu-lendinga-2025",
  title: "Как увеличить конверсию лендинга в 2025 году: полное руководство",
  excerpt:
    "Разбираем 15 проверенных техник повышения конверсии с примерами и данными из наших проектов. Все методы протестированы на реальных клиентах.",
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${article.title} | Блог WebConveyor`,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [article.coverImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
    alternates: {
      canonical: `https://webconveyor.ru/blog/${article.slug}`,
    },
  }
}

export default function ArticlePage() {
  return <ArticlePageClient />
}
