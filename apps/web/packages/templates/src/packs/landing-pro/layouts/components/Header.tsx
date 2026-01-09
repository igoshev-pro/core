"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { FaChevronDown } from "react-icons/fa6";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCTAClick = () => {
    // Можно открыть модалку или скроллить к форме
    const formElement = document.getElementById("contact-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // Если формы нет, можно открыть модалку
      // setModalOpen(true);
    }
  };

  const nichesItems = [
    { key: "dentistry", label: "Для стоматологий", href: "/niches/dentistry" },
    { key: "lawyers", label: "Для юристов", href: "/niches/lawyers" },
    { key: "beauty", label: "Для салонов красоты", href: "/niches/beauty" },
    { key: "auto", label: "Для автосервисов", href: "/niches/auto" },
  ];

  const comparisonsItems = [
    { key: "studios", label: "vs Студии", href: "/comparisons/studios" },
    { key: "freelancers", label: "vs Фрилансеры", href: "/comparisons/freelancers" },
    { key: "constructors", label: "vs Конструкторы", href: "/comparisons/constructors" },
  ];

  // Не рендерим на сервере, чтобы избежать ошибок гидратации
  if (!mounted) {
    return (
      <div className="h-20 w-full" /> // Placeholder для сохранения layout
    );
  }

  return (
    <HeroUINavbar
      className={`transition-all duration-300 ${
        isScrolled ? "h-16 shadow-md" : "h-20"
      }`}
      maxWidth="full"
      position="sticky"
      isBordered={isScrolled}
    >
      <NavbarContent className="gap-6" justify="start">
        <NavbarBrand as={Link} href="/" className="flex-shrink-0">
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation - Centered */}
      <NavbarContent className="hidden lg:flex gap-9" justify="center">
          <NavbarItem>
            <button
              onClick={() => handleScrollToSection("how-it-works")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Как работает
            </button>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/tarify"
              className={`${
                pathname === "/tarify" ? "text-primary font-medium" : "text-foreground"
              } hover:text-primary transition-colors cursor-pointer`}
            >
              Тарифы
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/cases"
              className={`${
                pathname === "/cases" ? "text-primary font-medium" : "text-foreground"
              } hover:text-primary transition-colors cursor-pointer`}
            >
              Кейсы
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/blog"
              className={`${
                pathname === "/blog" ? "text-primary font-medium" : "text-foreground"
              } hover:text-primary transition-colors cursor-pointer`}
            >
              Блог
            </Link>
          </NavbarItem>

          {/* Dropdown: Ниши */}
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors cursor-pointer">
                  Ниши
                  <FaChevronDown className="text-xs" />
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Ниши" items={nichesItems}>
                {(item: typeof nichesItems[0]) => (
                  <DropdownItem
                    key={item.key}
                    as={Link}
                    href={item.href}
                    className="text-foreground cursor-pointer"
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>

          {/* Dropdown: Сравнения */}
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors cursor-pointer">
                  Сравнения
                  <FaChevronDown className="text-xs" />
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Сравнения" items={comparisonsItems}>
                {(item: typeof comparisonsItems[0]) => (
                  <DropdownItem
                    key={item.key}
                    as={Link}
                    href={item.href}
                    className="text-foreground cursor-pointer"
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-6">
        {/* CTA Button - Desktop */}
        <NavbarItem className="hidden md:flex">
          <Button
            color="primary"
            variant="solid"
            radius="full"
            onPress={handleCTAClick}
            className="font-medium bg-primary-gradient"
            style={{
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            Оставить заявку
          </Button>
        </NavbarItem>

        {/* CTA Button - Mobile */}
        <NavbarItem className="md:hidden">
          <Button
            color="primary"
            variant="solid"
            radius="full"
            onPress={handleCTAClick}
            className="font-medium bg-primary-gradient"
            style={{
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            Позвонить
          </Button>
        </NavbarItem>

        {/* Mobile Menu Toggle */}
        <NavbarItem className="lg:hidden">
          <NavbarMenuToggle
            aria-label="Toggle menu"
            className="lg:hidden"
          />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6">
        <NavbarMenuItem>
          <button
            onClick={() => handleScrollToSection("how-it-works")}
            className="w-full text-left text-foreground hover:text-primary transition-colors py-2 cursor-pointer"
          >
            Как работает
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/tarify"
            className={`w-full block py-2 ${
              pathname === "/tarify" ? "text-primary font-medium" : "text-foreground"
            } hover:text-primary transition-colors cursor-pointer`}
          >
            Тарифы
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/cases"
            className={`w-full block py-2 ${
              pathname === "/cases" ? "text-primary font-medium" : "text-foreground"
            } hover:text-primary transition-colors cursor-pointer`}
          >
            Кейсы
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/blog"
            className={`w-full block py-2 ${
              pathname === "/blog" ? "text-primary font-medium" : "text-foreground"
            } hover:text-primary transition-colors cursor-pointer`}
          >
            Блог
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <div className="py-2">
            <p className="text-foreground font-medium mb-2">Ниши</p>
            <div className="flex flex-col gap-2 pl-4">
              {nichesItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors py-1 cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <div className="py-2">
            <p className="text-foreground font-medium mb-2">Сравнения</p>
            <div className="flex flex-col gap-2 pl-4">
              {comparisonsItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors py-1 cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
}

// Logo Component
function Logo() {
  // Соотношение сторон: 638x220 ≈ 2.9:1
  // При высоте h-12 (48px) ширина должна быть ~139px
  return (
    <div className="h-12" style={{ width: 'calc(3rem * 638 / 220)', position: 'relative' }}>
      <Image
        src="/img/system/logo-dark.png"
        alt="Logo"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
}
