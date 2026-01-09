"use client"

import { motion } from "framer-motion"
import { List } from "lucide-react"

const sections = [
  { id: "1", title: "Почему конверсия падает", level: 1 },
  { id: "2", title: "Аудит текущего состояния", level: 1 },
  { id: "3", title: "15 техник повышения конверсии", level: 1 },
  { id: "3-1", title: "Заголовки и УТП", level: 2 },
  { id: "3-2", title: "Социальное доказательство", level: 2 },
  { id: "3-3", title: "Формы захвата", level: 2 },
  { id: "4", title: "Примеры из практики", level: 1 },
  { id: "5", title: "Чек-лист для проверки", level: 1 },
  { id: "6", title: "Заключение", level: 1 },
]

export function TableOfContents() {
  return (
    <aside className="hidden lg:block">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky top-24"
      >
        <div className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-5 h-5 text-[#34C759]" />
            <h3 className="font-bold text-sm">Содержание</h3>
          </div>

          <nav className="space-y-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block text-sm hover:text-[#34C759] transition-colors ${
                  section.level === 2 ? "pl-4 text-white/60" : "text-white/80"
                } ${index === 0 ? "text-[#34C759] font-medium" : ""}`}
              >
                {section.level === 1 && `${index + 1}. `}
                {section.title}
              </a>
            ))}
          </nav>

          {/* Scroll Progress */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#34C759] to-[#00C7BE] w-1/3 transition-all" />
            </div>
            <p className="text-xs text-white/40 mt-2 text-center">33% прочитано</p>
          </div>
        </div>
      </motion.div>
    </aside>
  )
}
