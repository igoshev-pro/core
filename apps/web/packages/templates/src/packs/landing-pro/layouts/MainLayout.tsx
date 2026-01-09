import Header from "./components/Header";
import Footer from "./components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen min-h-screen flex flex-col p-0">
      <Header />
      <main className="w-full flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
