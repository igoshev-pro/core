"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const nichesDropdown = [
    { label: "Для стоматологий", href: "/dlya-stomatologii" },
    { label: "Для юристов", href: "/niches/yuristy" },
    { label: "Для салонов красоты", href: "/niches/salony" },
    { label: "Для автосервисов", href: "/niches/avtoservisy" },
  ];

  const comparisonsDropdown = [
    { label: "vs Студии", href: "/sravnenie/vs-studiya" },
    { label: "vs Фрилансеры", href: "/comparisons/freelancers" },
    { label: "vs Конструкторы", href: "/comparisons/constructors" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/5 backdrop-blur-xl border-b border-white/10 py-3" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            WebConveyor
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => smoothScroll("how-it-works")} className="hover:text-[#34C759] transition-colors">
              Как работает
            </button>
            <button onClick={() => smoothScroll("pricing")} className="hover:text-[#34C759] transition-colors">
              Тарифы
            </button>
            <button onClick={() => smoothScroll("cases")} className="hover:text-[#34C759] transition-colors">
              Кейсы
            </button>
            <Link href="/blog" className="hover:text-[#34C759] transition-colors">
              Блог
            </Link>

            {/* Ниши Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "niches" ? null : "niches")}
                className="flex items-center gap-1 hover:text-[#34C759] transition-colors"
              >
                Ниши <ChevronDown size={16} />
              </button>
              {openDropdown === "niches" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 min-w-[200px] shadow-xl"
                >
                  {nichesDropdown.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block px-4 py-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Сравнения Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "comparisons" ? null : "comparisons")}
                className="flex items-center gap-1 hover:text-[#34C759] transition-colors"
              >
                Сравнения <ChevronDown size={16} />
              </button>
              {openDropdown === "comparisons" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 min-w-[200px] shadow-xl"
                >
                  {comparisonsDropdown.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block px-4 py-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </nav>

          <Button
            onClick={() => smoothScroll("cta")}
            className="hidden md:inline-flex bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-lg hover:shadow-[#34C759]/50 transition-all text-white rounded-full"
          >
            Оставить заявку
          </Button>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Fullscreen Menu */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[72px] md:hidden bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] z-40 overflow-y-auto"
          >
            <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <button
                onClick={() => smoothScroll("how-it-works")}
                className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
              >
                Как работает
              </button>
              <button
                onClick={() => smoothScroll("pricing")}
                className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
              >
                Тарифы
              </button>
              <button
                onClick={() => smoothScroll("cases")}
                className="text-left text-2xl hover:text-[#34C759] transition-colors py-2"
              >
                Кейсы
              </button>
              <Link href="/blog" className="text-left text-2xl hover:text-[#34C759] transition-colors py-2">
                Блог
              </Link>

              {/* Mobile Ниши */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-sm text-gray-400 mb-3">Ниши</p>
                {nichesDropdown.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block text-lg py-2 hover:text-[#34C759] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Сравнения */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-sm text-gray-400 mb-3">Сравнения</p>
                {comparisonsDropdown.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block text-lg py-2 hover:text-[#34C759] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Button
                onClick={() => smoothScroll("cta")}
                size="lg"
                className="mt-6 bg-gradient-to-r from-[#34C759] to-[#00C7BE] text-white rounded-full text-lg"
              >
                Позвонить
              </Button>
            </nav>
          </motion.div>
        </>
      )}
    </motion.header>
  );
}
