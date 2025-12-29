import { ThemeSwitch } from "@/components/theme-switch";
import { SearchAdminShell} from "./components/SearchAdminShell";
import { LogoAdminShell } from "./components/LogoAdminShell";
import { NotificationsAdminShell } from "./components/NotificationsAdminShell";
import UserBalanceAdminShell from "./components/UserBalanceAdminShell";

import LogoutAdminShell from "./components/LogoutAdminShell";
import SideMenuMainLayout from "./components/SideMenuMainLayout";
import SupportAdminShell from "./components/SupportAdminShell";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen px-9">
      {/* Шапка */}
      <div className="grid grid-cols-5 py-8">
        <div className="col-span-2 sm:col-span-1 flex items-center">
          <LogoAdminShell />
        </div>
        <div className="col-span-4 hidden sm:grid sm:grid-cols-2 gap-6">
          <SearchAdminShell api="users" />
          <div className="col-span-1 flex items-center justify-end gap-6">
            <LanguageSwitcher />
            <ThemeSwitch className="" />
            <NotificationsAdminShell />
            <UserBalanceAdminShell />
            <LogoutAdminShell />
          </div>
        </div>
      </div>

      {/* Основная часть */}
      <div className="grid grid-cols-1 sm:grid-cols-4 min-h-[calc(100vh-120px)]">
        {/* Боковое меню */}
        <div className="col-span-1 hidden sm:flex flex-col justify-between pr-9 pb-9 gap-6 transition-all duration-1000 animate-appearance-in">
          <SideMenuMainLayout />
          <SupportAdminShell />
        </div>

        {/* Контент */}
        <div className="col-span-4 bg-foreground-100 mb-9 rounded-4xl p-9">
          {children}
        </div>
      </div>
    </div>
  );
}
