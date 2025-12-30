import { AuthLogo } from "./components/AuthLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-secondary justify-between items-center w-screen h-screen py-[100px]">
      {/* Левая панель (desktop) / Верх + низ (mobile) */}
    
      <AuthLogo className="" />

      {/* Контент */}
        <main className="!min-w-[350-px]">
          {children}
        </main>

      {/* Текст снизу на mobile / по центру на desktop */}
        <div className="text-2xl md:text-4xl font-semibold text-white leading-tight md:leading-[64px] text-center">
          {/* Панель управления вашим
          <span className="text-primary dark:text-secondary"> бизнесом</span> */}
          Панель управления вашим бизнесом
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
