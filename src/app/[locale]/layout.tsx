import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactElement } from "react";
import "@/app/globals.css";
import Header from "@/ui/header";
import { getCurrentUser } from "@/lib/auth/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swagger Editor & Document Viewer Client",
  description: "Interactive OpenAPI documentation manager tool.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>): Promise<ReactElement> {
  const { locale } = await params;
  const user = await getCurrentUser();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header isLoggedin={Boolean(user)} />
        {children}
      </body>
    </html>
  );
}
