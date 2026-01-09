import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryNames: Record<string, string> = {
    conversion: "Конверсия",
    seo: "SEO",
    design: "Дизайн",
    development: "Разработка",
    analytics: "Аналитика",
    cases: "Кейсы",
  }

  const categoryName = categoryNames[params.category] || "Статьи"

  return {
    title: `Статьи о ${categoryName.toLowerCase()} | Блог WebConveyor`,
    description: `Практические статьи и руководства по теме "${categoryName}" для владельцев бизнеса и маркетологов.`,
    alternates: {
      canonical: `https://webconveyor.ru/blog/category/${params.category}`,
    },
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryNames: Record<string, string> = {
    conversion: "Конверсия",
    seo: "SEO",
    design: "Дизайн",
    development: "Разработка",
    analytics: "Аналитика",
    cases: "Кейсы",
  }

  const categoryName = categoryNames[params.category] || "Статьи"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#34C759]/20 rounded-full blur-[128px] animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#00C7BE]/20 rounded-full blur-[128px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative">
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent"
            >
              WebConveyor
            </Link>
            <Link href="/blog">
              <Button variant="outline" className="rounded-full bg-transparent">
                ← Все статьи
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Блог
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{categoryName}</span>
          </nav>

          <h1 className="text-5xl font-bold mb-4">Статьи о {categoryName.toLowerCase()}</h1>
          <p className="text-xl text-white/70 mb-12">
            Практические руководства и кейсы для повышения эффективности вашего бизнеса
          </p>

          {/* Articles grid would go here - reuse from blog listing */}
          <div className="text-center py-20">
            <p className="text-white/60">Статьи категории "{categoryName}" будут отображаться здесь</p>
            <Link href="/blog" className="mt-4 inline-block">
              <Button className="rounded-full bg-gradient-to-r from-[#34C759] to-[#00C7BE]">Вернуться к блогу</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
