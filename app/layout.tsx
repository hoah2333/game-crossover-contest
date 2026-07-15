import "./globals.css";

import { Inter } from "next/font/google";

import type { Metadata } from "next";
import type { ReactNode } from "react";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = { title: "2026 电子游戏竞赛", description: "2026 电子游戏竞赛" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
