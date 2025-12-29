import { ThemeSwitch } from "@/components/theme-switch";
import { SearchAdminShell } from "./components/SearchAdminShell";
import { LogoAdminShell } from "./components/LogoAdminShell";
import { NotificationsAdminShell } from "./components/NotificationsAdminShell";
import UserBalanceAdminShell from "./components/UserBalanceAdminShell";

import LogoutAdminShell from "./components/LogoutAdminShell";
import SideMenuMainLayout from "./components/SideMenuMainLayout";
import SupportAdminShell from "./components/SupportAdminShell";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import BurgerMenu from "./components/BurgerMenu";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen px-0 sm:px-9">
      {/* Шапка */}
      <div className="grid grid-cols-5 px-6 sm:px-0 py-4 sm:py-8">
        <div className="col-span-2 md:col-span-1 flex items-center">
          <LogoAdminShell />
        </div>
        <div className="w-full flex md:hidden col-span-3 justify-end items-center">
          <BurgerMenu />
        </div>

        <div className="col-span-4 hidden md:block md:grid grid-cols-2 gap-6">
          {/* <div className="hidden md:flex lg:hidden"/> */}
          <SearchAdminShell api="users" className="hidden lg:flex" />
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center justify-end gap-6">
            <LanguageSwitcher />
            <ThemeSwitch className="" />
            <NotificationsAdminShell />
            <UserBalanceAdminShell />
            <LogoutAdminShell />
          </div>
        </div>
      </div>

      {/* Основная часть */}
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[calc(100vh-120px)]">
        {/* Боковое меню */}
        <div className="col-span-1 hidden sm:flex flex-col justify-between pr-9 pb-9 gap-6 transition-all duration-1000 animate-appearance-in">
          <SideMenuMainLayout />
          <SupportAdminShell />
        </div>

        {/* Контент */}
        <div className="col-span-4 bg-foreground-100 mb-9 rounded-4xl p-4 sm:p-9">
          {children}
        </div>
      </div>
    </div>
  );
}
