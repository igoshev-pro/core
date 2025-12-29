import { AuthLogo } from "./components/AuthLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 w-screen h-screen">
      {/* Левая панель (desktop) / Верх + низ (mobile) */}
      <div className="md:col-span-4 bg-secondary dark:bg-primary flex flex-col justify-between px-6 py-8 md:p-[80px]">
        {/* Logo */}
        <div className="flex justify-center md:mt-[80px]">
          <AuthLogo />
        </div>

      {/* Контент */}
      <div className="md:col-span-8 flex justify-center items-center px-4">
        <main className="w-full max-w-md md:max-w-none">
          {children}
        </main>
      </div>

      {/* Текст снизу на mobile / по центру на desktop */}
        <div className="text-2xl md:text-4xl font-semibold text-white leading-tight md:leading-[64px] text-center md:text-left mt-8 md:mt-0">
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
    </div>
  );
}
