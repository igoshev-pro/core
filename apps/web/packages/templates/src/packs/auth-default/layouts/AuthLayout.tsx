import { AuthLogo } from "./components/AuthLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-secondary justify-between items-center w-full h-screen py-8 md:py-[100px]">
      {/* Левая панель (desktop) / Верх + низ (mobile) */}
    
      <AuthLogo className="" />

      {/* Контент */}
        <main className="w-full flex items-center justify-center px-3 md:px-0 flex-1">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

      {/* Текст снизу на mobile / по центру на desktop */}
        <div className="w-full flex items-center justify-center px-3 md:px-0">
          <div className="text-2xl md:text-4xl font-semibold text-white leading-tight md:leading-[44px] text-center max-w-2xl">
            {/* Панель управления вашим
            <span className="text-primary dark:text-secondary"> бизнесом</span> */}
            Панель управления вашим бизнесом
          </div>
        </div>

        {/* Хештеги — только desktop */}
        {/* <div className="hidden md:flex gap-6 w-auto justify-between items-center">
          <p className="text-2xl font-bold text-white uppercase">
            <span className="text-primary dark:text-secondary">#</span>CMS
          </p>
          <p className="text-2xl font-bold text-white uppercase">
            <span className="text-primary dark:text-secondary">#</span>CRM
          </p>
          <p className="text-2xl font-bold text-white uppercase">
            <span className="text-primary dark:text-secondary">#</span>ERP
          </p>
          <p className="text-2xl font-bold text-white uppercase">
            <span className="text-primary dark:text-secondary">#</span>BI
          </p>
        </div> */}
      </div>
  );
}
