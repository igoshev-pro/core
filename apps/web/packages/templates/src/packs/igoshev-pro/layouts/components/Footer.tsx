"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative py-12 px-4 border-t border-white/10 bg-white/5 backdrop-blur">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent mb-4">
              WebConveyor
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Продукт</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => smoothScroll("pricing")}
                  className="text-gray-400 hover:text-[#34C759] transition-colors"
                >
                  Тарифы
                </button>
              </li>
              <li>
                <button
                  onClick={() => smoothScroll("how-it-works")}
                  className="text-gray-400 hover:text-[#34C759] transition-colors"
                >
                  Как работает
                </button>
              </li>
              <li>
                <button
                  onClick={() => smoothScroll("cases")}
                  className="text-gray-400 hover:text-[#34C759] transition-colors"
                >
                  Кейсы
                </button>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Ниши</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dlya-stomatologii" className="text-gray-400 hover:text-[#34C759] transition-colors">
                  Стоматологии
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                  Юристы
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                  Салоны красоты
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                  Автосервисы
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">+7 (XXX) XXX-XX-XX</li>
              <li className="text-gray-400">email@domain.ru</li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                  Telegram
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#34C759] transition-colors">
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>© 2026 WebConveyor. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
