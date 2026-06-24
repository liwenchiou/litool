"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function JsonFormatterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const defaultJson = `{"name":"litool","version":"1.0.0","features":["Fast","Secure","Minimalist"],"isAwesome":true,"author":{"name":"Liwen","role":"Developer"}}`;
  
  const [rawInput, setRawInput] = useState(defaultJson);
  const [formattedOutput, setFormattedOutput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState<"raw" | "formatted" | null>(null);

  // 初始化與當輸入改變時，自動解析
  useEffect(() => {
    try {
      if (!rawInput.trim()) {
        setFormattedOutput("");
        setErrorMsg(null);
        return;
      }
      const parsed = JSON.parse(rawInput);
      setFormattedOutput(JSON.stringify(parsed, null, indent));
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid JSON");
    }
  }, [rawInput, indent]);

  // GSAP 進場動畫
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".page-header", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all" })
      .from(".tool-panel", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "all" }, "-=0.3");
  }, { scope: containerRef });

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(rawInput);
      setRawInput(JSON.stringify(parsed));
    } catch (err) {
      // 若錯誤則不處理
    }
  };

  const copyToClipboard = (text: string, type: "raw" | "formatted") => {
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
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold tracking-tight text-white">JSON Formatter</h1>
        </div>
        <div className="space-y-3">
          <p className="text-zinc-400">
            嚴謹的 JSON 格式化、驗證與壓縮工具。直接在瀏覽器端解析，確保敏感資料絕不外流。
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-lg border border-white/5 inline-block">
            <span className="text-zinc-300">💡 提示：</span>
            在左側貼上凌亂的 JSON，右側會自動幫你排版。也可以點擊 Minify 進行壓縮。
          </div>
        </div>
      </div>

      {/* 雙欄編輯區 (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        
        {/* 左側：Raw JSON */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all shadow-xl h-[600px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-200">Raw JSON</span>
              {errorMsg && (
                <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">
                  {errorMsg}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleMinify}
                disabled={!!errorMsg || !rawInput}
                className="text-xs text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
              >
                Minify
              </button>
              <button 
                onClick={() => setRawInput("")}
                className="text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="flex-1 w-full bg-zinc-950/50 p-5 text-zinc-100 placeholder:text-zinc-600 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed"
          />
        </div>

        {/* 右側：Formatted JSON */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all shadow-xl h-[600px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-200">Formatted Output</span>
              <select 
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="text-xs bg-zinc-800 text-zinc-300 border border-zinc-700/50 rounded-md px-2 py-1 outline-none"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
            <button 
              onClick={() => copyToClipboard(formattedOutput, "formatted")}
              className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
            >
              {copied === "formatted" ? (
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
            readOnly
            value={formattedOutput}
            placeholder={errorMsg ? "Fix errors to format JSON..." : "Formatted JSON will appear here..."}
            className={`flex-1 w-full p-5 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed ${
              errorMsg ? "bg-red-950/20 text-red-300" : "bg-zinc-950/50 text-zinc-100"
            }`}
          />
        </div>

      </div>
    </div>
  );
}
