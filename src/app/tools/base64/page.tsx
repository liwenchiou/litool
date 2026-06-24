"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Base64Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [plainText, setPlainText] = useState("Hello from litool! 🚀\n這是一個 Base64 轉換工具的測試。");
  const [base64Text, setBase64Text] = useState("");

  // 初始掛載時自動計算一次 Base64
  useEffect(() => {
    setBase64Text(btoa(unescape(encodeURIComponent("Hello from litool! 🚀\n這是一個 Base64 轉換工具的測試。"))));
  }, []);
  const [copied, setCopied] = useState<"plain" | "base64" | null>(null);

  // GSAP 進場動畫
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".page-header", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all" })
      .from(".tool-panel", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "all" }, "-=0.3");
  }, { scope: containerRef });

  // 處理純文字輸入 -> 轉 Base64
  const handlePlainChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPlainText(val);
    try {
      // 支援中文字的 Base64 編碼
      setBase64Text(btoa(unescape(encodeURIComponent(val))));
    } catch (err) {
      setBase64Text("Invalid Input");
    }
  };

  // 處理 Base64 輸入 -> 轉純文字
  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBase64Text(val);
    try {
      if (!val) {
        setPlainText("");
        return;
      }
      setPlainText(decodeURIComponent(escape(atob(val))));
    } catch (err) {
      // 容錯處理，如果在輸入一半時無法解析，就不更新 plainText 或是顯示錯誤
    }
  };

  // 複製到剪貼簿
  const copyToClipboard = (text: string, type: "plain" | "base64") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div ref={containerRef} className="min-h-full p-6 sm:p-12 md:p-20 max-w-6xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-10 flex flex-col items-start gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">Base64 Encoder / Decoder</h1>
        <div className="space-y-3">
          <p className="text-zinc-400">
            即時將純文字與 Base64 格式互相轉換，支援 UTF-8 (中文) 字元。資料完全在瀏覽器端處理，安全無隱私風險。
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-lg border border-white/5 inline-block">
            <span className="text-zinc-300">💡 提示：</span>
            將明碼寫在左側 <strong className="text-zinc-200">Plain Text</strong> 進行編碼，或將 Base64 貼在右側 <strong className="text-zinc-200">Base64 Encoded</strong> 進行解碼。
          </div>
        </div>
      </div>

      {/* 雙欄編輯區 (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        
        {/* 左側：純文字 */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all shadow-xl">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <span className="text-sm font-medium text-zinc-200">Plain Text</span>
            <button 
              onClick={() => copyToClipboard(plainText, "plain")}
              className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
            >
              {copied === "plain" ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <textarea
            value={plainText}
            onChange={handlePlainChange}
            placeholder="Type or paste plain text here..."
            className="flex-1 w-full bg-zinc-950/50 p-5 text-zinc-100 placeholder:text-zinc-600 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed"
          />
        </div>

        {/* 右側：Base64 */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all shadow-xl">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <span className="text-sm font-medium text-zinc-200">Base64 Encoded</span>
            <button 
              onClick={() => copyToClipboard(base64Text, "base64")}
              className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
            >
              {copied === "base64" ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <textarea
            value={base64Text}
            onChange={handleBase64Change}
            placeholder="SGVsbG8gV29ybGQ="
            className="flex-1 w-full bg-zinc-950/50 p-5 text-zinc-100 placeholder:text-zinc-600 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed"
          />
        </div>

      </div>
    </div>
  );
}
