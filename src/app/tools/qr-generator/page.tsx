"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://litool.app");

  const downloadQR = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
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
          <QrCode className="w-8 h-8 text-blue-400" />
          QR Code Generator
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          即時將網址或任何純文字轉換為 QR Code。完全在你的瀏覽器端產生，無伺服器紀錄，保證隱私安全。
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Input */}
        <div className="flex flex-col gap-6">
          <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all shadow-xl p-6 flex flex-col h-full min-h-[300px]">
            <label htmlFor="qr-input" className="text-sm font-medium text-zinc-300 mb-3 block">
              內容 (Content)
            </label>
            <textarea
              id="qr-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="輸入網址或任意文字..."
              className="flex-1 w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 resize-none outline-none focus:ring-1 focus:ring-blue-500/50 font-mono text-sm leading-relaxed transition-colors shadow-inner shadow-black/20"
            />
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col gap-6">
          <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-xl p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
            
            {text ? (
              <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  <QRCodeCanvas
                    id="qr-canvas"
                    value={text}
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"Q"}
                    marginSize={1}
                  />
                </div>
                
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  下載 PNG
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500 gap-4">
                <QrCode className="w-16 h-16 opacity-20" />
                <p>請在左側輸入內容以產生條碼</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
