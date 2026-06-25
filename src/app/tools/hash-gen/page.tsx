"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CryptoJS from "crypto-js";

export default function HashGeneratorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultText = "Hello from litool! 🚀";
  const [plainText, setPlainText] = useState(defaultText);
  const [copied, setCopied] = useState<string | null>(null);

  const [hashes, setHashes] = useState({
    md5: CryptoJS.MD5(defaultText).toString(),
    sha1: CryptoJS.SHA1(defaultText).toString(),
    sha256: CryptoJS.SHA256(defaultText).toString(),
    sha512: CryptoJS.SHA512(defaultText).toString()
  });

  // GSAP 進場動畫
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".page-header", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all" })
      .from(".tool-panel", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "all" }, "-=0.3");
  }, { scope: containerRef });

  // 處理純文字輸入 -> 即時計算所有 Hash
  const handlePlainChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPlainText(val);
    
    if (!val) {
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
      return;
    }

    setHashes({
      md5: CryptoJS.MD5(val).toString(),
      sha1: CryptoJS.SHA1(val).toString(),
      sha256: CryptoJS.SHA256(val).toString(),
      sha512: CryptoJS.SHA512(val).toString()
    });
  };

  // 複製到剪貼簿
  const copyToClipboard = (text: string, type: string) => {
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
        <h1 className="text-3xl font-bold tracking-tight text-white">Hash Generator</h1>
        <div className="space-y-3">
          <p className="text-zinc-400">
            產生 MD5, SHA-1, SHA-256, SHA-512 等多種雜湊演算法結果。所有運算皆在本地端完成，保障資料安全。
          </p>
          <div className="flex items-start sm:items-center gap-2 text-sm text-amber-200/90 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20 inline-block shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="text-amber-400 font-semibold whitespace-nowrap">💡 提示：</span>
            在左側輸入任何文字，右側會即時產生所有對應的 Hash 值。
          </div>
        </div>
      </div>

      {/* 雙欄編輯區 (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        
        {/* 左側：純文字輸入 */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all shadow-xl h-[500px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <label htmlFor="hash-input" className="text-sm font-medium text-zinc-200">Input Text</label>
            <button 
              onClick={() => { setPlainText(""); setHashes({ md5: "", sha1: "", sha256: "", sha512: "" }); }}
              aria-label="Clear Input"
              className="text-xs text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
            >
              Clear
            </button>
          </div>
          <textarea
            id="hash-input"
            value={plainText}
            onChange={handlePlainChange}
            placeholder="Type or paste plain text here..."
            className="flex-1 w-full bg-black/40 shadow-inner shadow-black/50 p-5 text-zinc-100 placeholder:text-zinc-600 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed"
          />
        </div>

        {/* 右側：Hash 結果列表 */}
        <div className="tool-panel flex flex-col gap-4">
          {[
            { id: "md5", name: "MD5", value: hashes.md5 },
            { id: "sha1", name: "SHA-1", value: hashes.sha1 },
            { id: "sha256", name: "SHA-256", value: hashes.sha256 },
            { id: "sha512", name: "SHA-512", value: hashes.sha512 },
          ].map((item) => (
            <div key={item.id} className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all shadow-md group hover:border-zinc-600 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600">
              <div className="flex justify-between items-center px-4 py-2.5 border-b border-zinc-800 bg-zinc-800/40">
                <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                <button 
                  onClick={() => copyToClipboard(item.value, item.id)}
                  aria-label={`Copy ${item.name} hash`}
                  className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-zinc-800 px-2 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
                >
                  {copied === item.id ? (
                    <>
                      <svg aria-hidden="true" className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span role="status" aria-live="polite">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-zinc-950/50">
                <p className="font-mono text-sm text-zinc-300 break-all select-all">
                  {item.value || <span className="text-zinc-700">Waiting for input...</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
