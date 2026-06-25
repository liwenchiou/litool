import React from "react";
import Link from "next/link";
import { Command, Globe, BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="nav-bar sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 animate-fade-in-down">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Command className="w-5 h-5 text-zinc-100 group-hover:text-blue-400 transition-colors" />
          <span className="text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-blue-400 transition-colors">
            litool
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="https://www.liwen.studio" target="_blank" rel="noopener noreferrer" aria-label="Official Website" className="text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm group">
            <Globe className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
            <span className="hidden sm:inline">LW Studio.</span>
          </a>
          <a href="https://garden.liwen.studio" target="_blank" rel="noopener noreferrer" aria-label="Blog" className="text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm group">
            <BookOpen className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
            <span className="hidden sm:inline">LW Docusaurus</span>
          </a>

          <a href="https://github.com/liwenchiou/litool" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" className="text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:text-white transition-colors"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
