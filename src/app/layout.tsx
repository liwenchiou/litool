import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://litool.liwen.studio"),
  title: "litool - Developer & Everyday Tools",
  description: "一個專注於效能與簡潔體驗的線上工具箱。提供圖片壓縮、日期計算、JSON 格式化等多種純前端實用工具。無需註冊、無廣告，為開發與日常任務提供最純粹的解決方案。",
  keywords: ["線上工具", "開發者工具", "圖片壓縮", "JSON 格式化", "日期計算", "Base64", "正則表達式測試", "Hash 產生器", "litool"],
  authors: [{ name: "Liwen" }],
  openGraph: {
    title: "litool - Developer & Everyday Tools",
    description: "專為現代開發者與大眾打造的極簡線上工具箱，免註冊無廣告。",
    url: "https://litool.liwen.studio",
    siteName: "litool",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "litool - Developer & Everyday Tools",
    description: "專為現代開發者與大眾打造的極簡線上工具箱，免註冊無廣告。",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TB8T6ZEDLL"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TB8T6ZEDLL');
          `}
        </Script>

        {/* JSON-LD 結構化資料 (SEO & AEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "litool - Developer & Everyday Tools",
              "url": "https://litool.liwen.studio",
              "description": "一個專注於效能與簡潔體驗的線上工具箱。提供圖片壓縮、日期計算、JSON 格式化等多種純前端實用工具。無需註冊、無廣告，為開發與日常任務提供最純粹的解決方案。",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Liwen",
                "url": "https://garden.liwen.studio"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-zinc-50 selection:bg-zinc-800">
        <Navbar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>

        {/* 全域 Footer */}
        <footer className="border-t border-white/10 bg-zinc-950 py-12 mt-auto">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-sm text-zinc-500">
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-200 text-lg tracking-wide">litool</span>
              </div>
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
              <p className="text-xs text-zinc-600 max-w-xs text-center md:text-left">
                專注於效能與簡潔體驗的線上工具箱，為開發與日常任務提供最純粹的解決方案。
              </p>
            </div>

            {/* Links Columns */}
            <div className="flex flex-wrap justify-center md:justify-end gap-12 sm:gap-16">
              <div className="flex flex-col gap-4 text-center md:text-left">
                <span className="text-zinc-300 font-medium tracking-wide">關於</span>
                <a href="https://github.com/liwenchiou" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">GitHub</a>
                <a href="https://garden.liwen.studio/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">LW Docusaurus</a>
                <a href="https://www.liwen.studio/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">LW Studio</a>
              </div>

              <div className="flex flex-col gap-4 text-center md:text-left">
                <span className="text-zinc-300 font-medium tracking-wide">法規</span>
                <Link href="/privacy" className="hover:text-zinc-200 transition-colors">隱私權政策</Link>
                <Link href="/disclaimer" className="hover:text-zinc-200 transition-colors">免責聲明</Link>
              </div>

              <div className="flex flex-col gap-4 text-center md:text-left">
                <span className="text-zinc-300 font-medium tracking-wide">支援</span>
                <a href="mailto:service@liwen.studio" className="hover:text-zinc-200 transition-colors">聯絡我們</a>
                <a href="https://github.com/liwenchiou/litool/issues" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">回報 Bug</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
