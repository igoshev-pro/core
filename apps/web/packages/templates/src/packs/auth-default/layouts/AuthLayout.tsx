import { AuthLogo } from "./components/AuthLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="!grid grid-cols-12 w-screen h-screen">
      <div className="col-span-4 bg-secondary dark:bg-primary flex flex-col gap-8 justify-between p-[80px]">
        <div className="flex justify-center mt-[80px]">
          <AuthLogo />
        </div>
        <div className="text-4xl font-bold text-white uppercase leading-[64px]">
          Панель управления вашим
          <span className="text-primary dark:text-secondary"> бизнесом</span>
        </div>
        <div className="flex justify-between items-center">
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
        </div>
      </div>
      <div className="col-span-8 flex justify-center items-center">
        <main>{children}</main>
      </div>
    </div>
  );
}