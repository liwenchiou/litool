"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Search, 
  Image as ImageIcon, 
  CalendarDays, 
  Code, 
  FileJson, 
  Calculator, 
  Settings2,
  Coins,
  QrCode,
  Key,
  FileCode2,
  Clock,
  Palette,
  Database
} from "lucide-react";
import FeedbackCTA from "@/components/FeedbackCTA";

// 簡約專業風格的工具資料
const tools = [
  {
    id: "img-compress",
    title: "Image Compressor",
    description: "在本地端快速壓縮 PNG 與 JPEG，保障圖片隱私不外流。",
    icon: <ImageIcon className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />,
    category: "Media"
  },
  {
    id: "date-calc",
    title: "Date Calculator",
    description: "計算日期區間或推算未來特定工作日，支援多種時區。",
    icon: <CalendarDays className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />,
    category: "Utility"
  },
  {
    id: "json-format",
    title: "JSON Formatter",
    description: "嚴謹的 JSON 格式化、驗證與高亮工具。",
    icon: <FileJson className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "base64",
    title: "Base64 Encoder",
    description: "安全且快速的字串與檔案 Base64 編解碼轉換。",
    icon: <Code className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "regex-tester",
    title: "RegExp Tester",
    description: "即時測試正則表達式，視覺化匹配結果與群組。",
    icon: <Settings2 className="w-5 h-5 text-rose-400 group-hover:text-rose-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "hash-gen",
    title: "Hash Generator",
    description: "產生 MD5, SHA-1, SHA-256 等多種雜湊演算法結果。",
    icon: <Calculator className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "currency-converter",
    title: "Currency Converter",
    description: "即時計算多國貨幣匯率。採用最新的公開匯率資料，方便出國旅遊與投資換算。",
    icon: <Coins className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />,
    category: "Utility"
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "即時將網址或文字轉換為 QR Code，可快速下載為 PNG 圖片，純前端產生無隱私疑慮。",
    icon: <QrCode className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />,
    category: "Utility"
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "安全地解析 JSON Web Token，檢查 Payload 與過期時間，純本地端處理絕不外流。",
    icon: <Key className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "json-to-ts",
    title: "JSON to TS Interface",
    description: "貼上 JSON 結構，瞬間自動產生具備強型別的 TypeScript Interface。支援巢狀物件自動推導。",
    icon: <FileCode2 className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "cron-generator",
    title: "Cron Job Generator",
    description: "快速產生與翻譯 Cron 排程語法，附帶白話文解釋與常用設定預設值。",
    icon: <Clock className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "css-generator",
    title: "CSS Shadow Generator",
    description: "視覺化調整區塊陰影，並即時產出 Tailwind CSS 的 Arbitrary Value 或原生 CSS。",
    icon: <Palette className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />,
    category: "Developer"
  },
  {
    id: "mock-data",
    title: "Mock Data Generator",
    description: "一鍵產生高達數百筆的測試用假資料，支援自訂欄位並可匯出為 JSON 格式。",
    icon: <Database className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors" />,
    category: "Utility"
  }
];

const categories = ["All", "Developer", "Media", "Utility"];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = tools.filter((tool) => {
    const matchSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchSearch && matchCategory;
  });

  // 原本的 GSAP 動畫已被替換為輕量的 Tailwind 原生 CSS 動畫 (.animate-fade-in-up)
  // 以獲得極致的首頁載入速度與完美的 PageSpeed LCP 分數。

  return (
    <div className="min-h-screen font-sans selection:bg-zinc-800 overflow-x-hidden">

      <main className="max-w-5xl mx-auto px-6 pt-16 pb-24">

        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="hero-element text-4xl sm:text-5xl font-medium tracking-tight mb-4 text-zinc-100">
            Developer & Everyday Tools.
          </h1>
          <p className="hero-element text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed">
            一個專注於效能與簡潔體驗的線上工具箱。無需註冊、無廣告，為開發與日常任務提供最純粹的解決方案。
          </p>

          {/* 搜尋列 */}
          <div className="hero-element relative w-full max-w-xl animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="relative flex items-center bg-zinc-900/50 border border-white/10 rounded-lg transition-all focus-within:border-blue-500/50 focus-within:bg-zinc-900 focus-within:ring-2 focus-within:ring-blue-500/20">
              <Search className="w-5 h-5 text-zinc-500 ml-4" />
              <input
                type="text"
                aria-label="Search tools"
                placeholder="Search tools..."
                className="w-full bg-transparent border-none outline-none text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-500 focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-zinc-400 mr-3 border border-white/5">
                <kbd>⌘</kbd><kbd>K</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* 分類標籤 */}
        <div className="hero-element flex flex-wrap items-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-btn px-4 py-1.5 rounded-md text-sm transition-all ${activeCategory === cat
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-400 bg-zinc-900/30 border border-white/5 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 工具列表 */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, index) => (
              <Link
                href={`/tools/${tool.id}`}
                key={tool.id}
                className="tool-card relative overflow-hidden group p-5 rounded-xl border border-white/10 bg-zinc-900/20 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all cursor-pointer flex flex-col h-full block animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 50}ms` }}
              >
                {/* 背景光暈點綴 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/0 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 group-hover:bg-blue-500/10 transition-colors duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center">
                      {tool.icon}
                    </div>
                    <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed mt-1 flex-grow group-hover:text-zinc-400 transition-colors">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-zinc-500 border border-dashed border-white/10 rounded-xl">
            <p>No tools found matching your criteria.</p>
          </div>
        )}

      </main>

      {/* 全域 Feedback 區塊 */}
      <FeedbackCTA />
    </div>
  );
}
