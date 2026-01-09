"use client";

import Link from "next/link";
import { FaPhone, FaEnvelope, FaTelegram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: "Тарифы", href: "/tarify" },
    { label: "Как работает", href: "#how-it-works" },
    { label: "Калькулятор", href: "/calculator" },
    { label: "Кейсы", href: "/cases" },
    { label: "FAQ", href: "/faq" },
  ];

  const nichesLinks = [
    { label: "Стоматологии", href: "/niches/dentistry" },
    { label: "Юристы", href: "/niches/lawyers" },
    { label: "Салоны красоты", href: "/niches/beauty" },
    { label: "Автосервисы", href: "/niches/auto" },
    { label: "Ремонт", href: "/niches/repair" },
  ];

  const companyLinks = [
    { label: "О нас", href: "/about" },
    { label: "Блог", href: "/blog" },
    { label: "Партнёрам", href: "/partners" },
    { label: "Вакансии", href: "/careers" },
  ];

  const contactInfo = [
    { icon: FaPhone, label: "Телефон", value: "+7 (999) 123-45-67", href: "tel:+79991234567" },
    { icon: FaEnvelope, label: "Email", value: "info@example.com", href: "mailto:info@example.com" },
    { icon: FaTelegram, label: "Telegram", value: "@example", href: "https://t.me/example" },
    { icon: FaWhatsapp, label: "WhatsApp", value: "+7 (999) 123-45-67", href: "https://wa.me/79991234567" },
  ];

  const legalLinks = [
    { label: "Оферта", href: "/offer" },
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "ИП/ООО", href: "/legal" },
  ];

  return (
    <footer className="w-full bg-foreground-50 border-t border-foreground-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
          </div>

          {/* Продукт */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Продукт</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ниши */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Ниши</h3>
            <ul className="space-y-2">
              {nichesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Компания</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Контакты</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.label}>
                    <Link
                      href={contact.href}
                      className="flex items-center gap-2 text-foreground-600 hover:text-primary transition-colors"
                    >
                      <Icon className="text-foreground-400" />
                      <span>{contact.value}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-foreground-200 pt-8 mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-foreground-600 text-sm">
            © {currentYear} [Название]. Все права защищены.
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground-600 hover:text-primary text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Logo Component (same as Header)
function Logo() {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
    >
      <rect width="120" height="40" rx="4" fill="currentColor" className="text-primary" />
      <text
        x="60"
        y="25"
        textAnchor="middle"
        className="fill-white text-sm font-bold"
      >
        LOGO
      </text>
    </svg>
  );
}
