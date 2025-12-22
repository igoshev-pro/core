import React from "react";
import { TemplatePack } from "@/packages/renderer/src";
import Image from "next/image";

function PublicLayout({ children, slots }: any) {
  return (
    <div className="min-h-screen min-w-screen">
      <header>{slots?.header}</header>
      <main>{children}</main>
      <footer>{slots?.footer}</footer>
    </div>
  );
}

function HeroSection({ node, ctx }: any) {
  const title = (node.props?.title as string) ?? "Hero title";
  const subtitle = (node.props?.subtitle as string) ?? "Subtitle";
  return (
    <section style={{ padding: 40 }}>
      <h1 style={{ fontSize: 42, margin: 0 }}>{title}</h1>
      <p style={{ fontSize: 18, opacity: 0.8 }}>{subtitle}</p>
      <div style={{ marginTop: 16, opacity: 0.7 }}>projectId: {ctx.projectId}</div>
    </section>
  );
}

function TextWidget({ node }: any) {
  return <p style={{ padding: 16 }}>{(node.props?.text as string) ?? "text"}</p>;
}

function NotFoundWidget({ node }: any) {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-6">
      <Image
        src="/img/system/404.png"
        alt="404"
        width={600}
        height={400}
        priority
      />
      {/* <p className="text-4xl text-foreground">{(node.props?.text as string) ?? "text"}</p> */}
    </div>
  );
}

export const landingClassicPack: TemplatePack = {
  _id: "landing-classic",
  version: "1.0.0",
  layouts: {
    "public.default": PublicLayout,
  },
  sections: {
    "hero.v1": HeroSection,
  },
  widgets: {
    "text.v1": TextWidget,
    "404.v1": NotFoundWidget
  },
};
