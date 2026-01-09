import BlogClientPage from "./BlogClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Блог о создании сайтов | WebConveyor",
  description:
    "Статьи о разработке сайтов, лендингах, конверсии и привлечении клиентов. Практические советы для бизнеса.",
  keywords: ["создание сайтов", "лендинг", "конверсия", "веб-разработка", "сайт для бизнеса"],
  openGraph: {
    title: "Блог WebConveyor — всё о создании сайтов",
    description: "Практические статьи для владельцев бизнеса",
    type: "website",
    images: ["/og/blog.jpg"],
  },
  alternates: {
    canonical: "https://webconveyor.ru/blog",
  },
}

export default function BlogPage() {
  return <BlogClientPage />
}
