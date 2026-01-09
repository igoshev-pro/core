import React from "react";
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white overflow-x-hidden">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#34C759]/20 via-[#00C7BE]/20 to-[#34C759]/10 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
      </div>
      {slots?.header || <HeaderWrapper />}
      <main className="w-full flex-1 flex flex-col">
        {children}
      </main>
      {slots?.footer || <FooterWrapper />}
    </div>
  );
}
