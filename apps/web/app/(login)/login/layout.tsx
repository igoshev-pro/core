import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { withProjectId } from "@/api/utils/withProjectId";
import { headers } from "next/headers";
import "../../../styles/globals.css";



export default async function LoginRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
