import "@/app/globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Inter } from "next/font/google";

import type { Metadata } from "next";
import type { ReactNode } from "react";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "title" });
  return { title: t("contestName"), description: t("contestName"), icons: "/steam-logo.svg" };
};

export default async function RootLayout({
  children,
}: Readonly<{ params: Promise<{ locale: string }>; children: ReactNode }>): Promise<ReactNode> {
  const locale = await getLocale();

  return (
    <html lang={locale} className="scrollbar-thin scrollbar-thumb-white scrollbar-track-dark-bg">
      <body className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
