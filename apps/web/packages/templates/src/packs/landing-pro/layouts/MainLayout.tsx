import HeaderWrapper from "./components/HeaderWrapper";
import FooterWrapper from "./components/FooterWrapper";

export default function MainLayout({
  children,
  slots,
}: {
  children: React.ReactNode;
  slots?: {
    header?: React.ReactNode;
    footer?: React.ReactNode;
  };
}) {
  return (
    <div className="w-screen min-h-screen flex flex-col p-0">
      {slots?.header || <HeaderWrapper />}
      <main className="w-full flex-1 flex flex-col">
        {children}
      </main>
      {slots?.footer || <FooterWrapper />}
    </div>
  );
}
