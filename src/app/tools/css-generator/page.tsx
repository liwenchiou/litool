"use client";

import { useState } from "react";
import Link from "next/link";
import { Palette, Copy, Check } from "lucide-react";

export default function CssGeneratorPage() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(-3);
  const [opacity, setOpacity] = useState(0.1);
  const [color, setColor] = useState("#000000");

  const [copiedTailwind, setCopiedTailwind] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  // Convert hex to rgb for rgba
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `${r},${g},${b}`;
  };

  const rgbaColor = `rgba(${hexToRgb(color)},${opacity})`;
  const boxShadowValue = `${x}px ${y}px ${blur}px ${spread}px ${rgbaColor}`;
  
  const tailwindClass = `shadow-[${x}px_${y}px_${blur}px_${spread}px_${rgbaColor.replace(/\s/g, "")}]`;
  const cssCode = `box-shadow: ${boxShadowValue};`;

  const copy = (text: string, type: "tailwind" | "css") => {
    navigator.clipboard.writeText(text);
    if (type === "tailwind") {
      setCopiedTailwind(true);
      setTimeout(() => setCopiedTailwind(false), 2000);
    } else {
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  return (
    <div className="min-h-full p-6 sm:p-12 md:p-20 max-w-5xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-10 flex flex-col items-start gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Palette className="w-8 h-8 text-pink-400" />
          CSS Shadow Generator
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          視覺化調整區塊陰影，並即時產出 Tailwind CSS 的 Arbitrary Value (自訂值) 或是原生 CSS 語法。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Controls */}
        <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-4">設定參數</h2>
          
          {[
            { label: "X Offset (水平偏移)", min: -50, max: 50, val: x, set: setX, unit: "px" },
            { label: "Y Offset (垂直偏移)", min: -50, max: 50, val: y, set: setY, unit: "px" },
            { label: "Blur (模糊半徑)", min: 0, max: 100, val: blur, set: setBlur, unit: "px" },
            { label: "Spread (擴散半徑)", min: -50, max: 50, val: spread, set: setSpread, unit: "px" },
            { label: "Opacity (不透明度)", min: 0, max: 1, step: 0.01, val: opacity, set: setOpacity, unit: "" },
          ].map((slider, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-400 font-medium">{slider.label}</label>
                <span className="text-zinc-200 bg-zinc-800 px-2 py-1 rounded font-mono">
                  {slider.val}{slider.unit}
                </span>
              </div>
              <input 
                type="range" 
                min={slider.min} 
                max={slider.max} 
                step={slider.step || 1}
                value={slider.val}
                onChange={(e) => slider.set(parseFloat(e.target.value))}
                className="w-full accent-pink-500 hover:accent-pink-400 transition-all cursor-grab"
              />
            </div>
          ))}

          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-400 font-medium">Color (陰影顏色)</label>
                <span className="text-zinc-200 bg-zinc-800 px-2 py-1 rounded font-mono uppercase">
                  {color}
                </span>
              </div>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer bg-zinc-800 border-0 outline-none"
              />
          </div>
        </div>

        {/* Right: Preview & Output */}
        <div className="flex flex-col gap-6">
          {/* Preview Box */}
          <div className="tool-panel flex-1 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-xl flex items-center justify-center p-12 min-h-[300px] overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-500 to-transparent"></div>
             
             {/* The box to shadow */}
             <div 
               className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center z-10 transition-shadow duration-75"
               style={{ boxShadow: boxShadowValue }}
             >
                <span className="text-zinc-400 font-medium">Preview</span>
             </div>
          </div>

          {/* Output Code */}
          <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-800/40 text-sm font-medium text-pink-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span> Tailwind CSS
            </div>
            <div className="p-4 flex items-center justify-between gap-4 bg-zinc-950/50 group">
              <code className="text-sm font-mono text-zinc-300 break-all">{tailwindClass}</code>
              <button 
                onClick={() => copy(tailwindClass, "tailwind")}
                className="shrink-0 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700"
              >
                {copiedTailwind ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="px-5 py-3 border-y border-zinc-800 bg-zinc-800/40 text-sm font-medium text-blue-400 flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Vanilla CSS
            </div>
            <div className="p-4 flex items-center justify-between gap-4 bg-zinc-950/50 group">
              <code className="text-sm font-mono text-zinc-300 break-all">{cssCode}</code>
              <button 
                onClick={() => copy(cssCode, "css")}
                className="shrink-0 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700"
              >
                {copiedCss ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
