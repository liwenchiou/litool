"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// 輕量級 JSON 語法高亮函數
const syntaxHighlight = (json: string) => {
  if (!json) return "";
  let formatted = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return formatted.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-blue-400'; // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-purple-400 font-semibold'; // key
      } else {
        cls = 'text-emerald-400'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-amber-400'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-zinc-500 italic'; // null
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

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
          <div className="flex items-start sm:items-center gap-2 text-sm text-amber-200/90 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20 inline-block shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="text-amber-400 font-semibold whitespace-nowrap">💡 提示：</span>
            在左側貼上凌亂的 JSON，右側會自動幫你排版。也可以點擊 Minify 進行壓縮。
          </div>
        </div>
      </div>

      {/* 雙欄編輯區 (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        
        {/* 左側：Raw JSON */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all shadow-xl h-[600px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <label htmlFor="raw-json-input" className="text-sm font-medium text-zinc-200">Raw JSON</label>
              {errorMsg && (
                <span role="alert" aria-live="assertive" className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">
                  {errorMsg}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleMinify}
                disabled={!!errorMsg || !rawInput}
                aria-label="Minify JSON"
                className="text-xs text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
              >
                Minify
              </button>
              <button 
                onClick={() => setRawInput("")}
                aria-label="Clear Input"
                className="text-xs text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            id="raw-json-input"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste your JSON here..."
            aria-label="Raw JSON Input"
            className="flex-1 w-full bg-zinc-950/40 focus:bg-zinc-900/60 shadow-inner shadow-black/50 p-5 text-zinc-200 placeholder:text-zinc-600 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed transition-colors"
          />
        </div>

        {/* 右側：Formatted JSON */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all shadow-xl h-[600px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <label htmlFor="indent-select" className="text-sm font-medium text-zinc-200">Formatted Output</label>
              <select 
                id="indent-select"
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                aria-label="Select indentation level"
                className="text-xs bg-zinc-800 text-zinc-300 border border-zinc-700/50 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
            <button 
              onClick={() => copyToClipboard(formattedOutput, "formatted")}
              aria-label="Copy Formatted JSON"
              className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {copied === "formatted" ? (
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
          {errorMsg ? (
            <div className="flex-1 w-full p-5 bg-red-950/20 text-red-300 font-mono text-sm leading-relaxed overflow-auto">
              Fix errors to format JSON...
            </div>
          ) : (
            <pre 
              className="flex-1 w-full p-5 bg-zinc-950/50 text-zinc-100 font-mono text-sm leading-relaxed overflow-auto outline-none m-0 break-words whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: formattedOutput ? syntaxHighlight(formattedOutput) : "<span class='text-zinc-600'>Formatted JSON will appear here...</span>" 
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}
