"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavbarItem>
            <button
              onClick={() => handleScrollToSection("how-it-works")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Как работает
            </button>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/tarify"
              className={`${
                pathname === "/tarify" ? "text-primary font-medium" : "text-foreground"
              } hover:text-primary transition-colors`}
            >
              Тарифы
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/cases"
              className={`${
                pathname === "/cases" ? "text-primary font-medium" : "text-foreground"
              } hover:text-primary transition-colors`}
            >
              Кейсы
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/blog"
              className={`${
                pathname === "/blog" ? "text-primary font-medium" : "text-foreground"
              } hover:text-primary transition-colors`}
            >
              Блог
            </Link>
          </NavbarItem>

          {/* Dropdown: Ниши */}
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
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
                    className="text-foreground"
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
                <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
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
                    className="text-foreground"
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </div>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        {/* CTA Button - Desktop */}
        <NavbarItem className="hidden md:flex">
          <Button
            color="primary"
            variant="solid"
            onPress={handleCTAClick}
            className="font-medium"
          >
            Оставить заявку
          </Button>
        </NavbarItem>

        {/* CTA Button - Mobile */}
        <NavbarItem className="md:hidden">
          <Button
            color="primary"
            variant="solid"
            size="sm"
            onPress={handleCTAClick}
            className="font-medium"
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
            className="w-full text-left text-foreground hover:text-primary transition-colors py-2"
          >
            Как работает
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/tarify"
            className={`w-full block py-2 ${
              pathname === "/tarify" ? "text-primary font-medium" : "text-foreground"
            } hover:text-primary transition-colors`}
          >
            Тарифы
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/cases"
            className={`w-full block py-2 ${
              pathname === "/cases" ? "text-primary font-medium" : "text-foreground"
            } hover:text-primary transition-colors`}
          >
            Кейсы
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/blog"
            className={`w-full block py-2 ${
              pathname === "/blog" ? "text-primary font-medium" : "text-foreground"
            } hover:text-primary transition-colors`}
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
                  className="text-foreground hover:text-primary transition-colors py-1"
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
                  className="text-foreground hover:text-primary transition-colors py-1"
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
