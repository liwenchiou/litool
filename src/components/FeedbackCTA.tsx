import React from "react";
import { MessageSquare, Lightbulb } from "lucide-react";

export default function FeedbackCTA() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 md:px-20 pb-16 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-zinc-700 transition-colors">
        {/* 背景光暈點綴 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />
        
        <div className="relative z-10 w-full md:w-auto">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            遇到問題或是想許願新功能？
          </h3>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
            如果你發現任何 Bug，或是覺得 litool 可以加入什麼實用的開發者工具，歡迎到 GitHub Issues 告訴我！我會盡快處理。
          </p>
        </div>
        
        <div className="relative z-10 w-full md:w-auto shrink-0">
          <a 
            href="https://github.com/liwenchiou/litool/issues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
          >
            <MessageSquare className="w-4 h-4" />
            前往回報 / 許願
          </a>
        </div>
      </div>
    </div>
  );
}
