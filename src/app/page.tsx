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
  Command
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// 簡約專業風格的工具資料
const tools = [
  {
    id: "img-compress",
    title: "Image Compressor",
    description: "在本地端快速壓縮 PNG 與 JPEG，保障圖片隱私不外流。",
    icon: <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />,
    category: "Media"
  },
  {
    id: "date-calc",
    title: "Date Calculator",
    description: "計算日期區間或推算未來特定工作日，支援多種時區。",
    icon: <CalendarDays className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />,
    category: "Utility"
  },
  {
    id: "json-format",
    title: "JSON Formatter",
    description: "嚴謹的 JSON 格式化、驗證與高亮工具。",
    icon: <FileJson className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />,
    category: "Developer"
  },
  {
    id: "base64",
    title: "Base64 Encoder",
    description: "安全且快速的字串與檔案 Base64 編解碼轉換。",
    icon: <Code className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />,
    category: "Developer"
  },
  {
    id: "regex-tester",
    title: "RegExp Tester",
    description: "即時測試正則表達式，視覺化匹配結果與群組。",
    icon: <Settings2 className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />,
    category: "Developer"
  },
  {
    id: "hash-gen",
    title: "Hash Generator",
    description: "產生 MD5, SHA-1, SHA-256 等多種雜湊演算法結果。",
    icon: <Calculator className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />,
    category: "Developer"
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

  // GSAP 進場動畫與過濾時的動畫
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // 導覽列與 Hero 文字淡入
    tl.from(".nav-bar", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all" })
      .from(".hero-element", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "all" }, "-=0.3");
      
  }, { scope: containerRef });

  useGSAP(() => {
    // 當工具列表改變時，重新播放卡片進場動畫
    gsap.from(".tool-card", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power3.out",
      clearProps: "all" // 清除殘留的內聯樣式
    });
  }, { dependencies: [filteredTools, activeCategory], scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-zinc-800">
      
      {/* 導覽列 */}
      <nav className="nav-bar sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-zinc-100" />
            <span className="text-sm font-semibold tracking-wide">
              litool
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

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
          <div className="hero-element relative w-full max-w-xl">
            <div className="relative flex items-center bg-zinc-900/50 border border-white/10 rounded-lg transition-colors focus-within:border-white/30 focus-within:bg-zinc-900">
              <Search className="w-5 h-5 text-zinc-500 ml-4" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="w-full bg-transparent border-none outline-none text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-500"
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
        <div className="hero-element flex flex-wrap items-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-btn px-4 py-1.5 rounded-md text-sm transition-all ${
                activeCategory === cat 
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
            {filteredTools.map((tool) => (
              <Link 
                href={`/tools/${tool.id}`}
                key={tool.id} 
                className="tool-card group p-5 rounded-xl border border-white/10 bg-zinc-900/20 hover:bg-zinc-900/80 transition-all cursor-pointer flex flex-col h-full block"
              >
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-zinc-500 border border-dashed border-white/10 rounded-xl">
            <p>No tools found matching your criteria.</p>
          </div>
        )}

      </main>
    </div>
  );
}
