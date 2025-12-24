"use client";

import Image from "next/image";

export default function Error({ error }: { error: Error & { digest?: string } }) {
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