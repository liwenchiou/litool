"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function RegexTesterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const defaultRegex = "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b";
  const defaultText = "Welcome to litool!\n\nYou can contact us at support@example.com or directly email the admin at admin@test-domain.org.\nLet's test some regex!";
  
  const [regexStr, setRegexStr] = useState(defaultRegex);
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState(defaultText);
  
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 當正則或字串改變時重新運算
  useEffect(() => {
    if (!regexStr) {
      setMatches([]);
      setErrorMsg(null);
      return;
    }

    try {
      const regex = new RegExp(regexStr, flags);
      setErrorMsg(null);
      
      if (!testString) {
        setMatches([]);
        return;
      }

      if (flags.includes('g')) {
        const found = [...testString.matchAll(regex)];
        setMatches(found);
      } else {
        const match = testString.match(regex);
        setMatches(match ? [match as RegExpMatchArray] : []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid Regular Expression");
      setMatches([]);
    }
  }, [regexStr, flags, testString]);
  // 渲染高亮文字
  const renderHighlightedText = () => {
    if (errorMsg || !regexStr || matches.length === 0) {
      return <span className="text-zinc-500">{testString || "Waiting for input..."}</span>;
    }

    try {
      const regex = new RegExp(regexStr, flags);
      const parts = [];
      let lastIndex = 0;

      // 重建高亮區塊 (僅在 global 模式或找到第一個時有效)
      const matchesToHighlight = flags.includes('g') ? [...testString.matchAll(regex)] : [testString.match(regex)!].filter(Boolean);

      matchesToHighlight.forEach((match, i) => {
        if (match.index !== undefined) {
          // Push preceding text
          if (match.index > lastIndex) {
            parts.push(testString.substring(lastIndex, match.index));
          }
          // Push matched text
          parts.push(
            <mark key={i} className="bg-blue-500/30 text-blue-200 rounded px-0.5">
              {match[0]}
            </mark>
          );
          lastIndex = match.index + match[0].length;
        }
      });

      // Push remaining text
      if (lastIndex < testString.length) {
        parts.push(testString.substring(lastIndex));
      }

      return parts;
    } catch (e) {
      return testString;
    }
  };

  return (
    <div ref={containerRef} className="min-h-full p-6 sm:p-12 md:p-20 max-w-6xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-8 flex flex-col items-start gap-4">

        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold tracking-tight text-white">RegExp Tester</h1>
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700/50 transition-colors"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Cheat Sheet
          </button>
        </div>
        <div className="space-y-3">
          <p className="text-zinc-400">
            即時測試正則表達式，自動比對並高亮字串，支援多種 Flags 設定。
          </p>
          <div className="flex items-start sm:items-center gap-2 text-sm text-amber-200/90 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20 inline-block shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="text-amber-400 font-semibold whitespace-nowrap">💡 提示：</span>
            在上方輸入正則表達式，下方即時顯示高亮與匹配結果（Matches）。點擊右上角 Cheat Sheet 查看語法教學。
          </div>
        </div>
      </div>

      {/* 正則表達式輸入區 */}
      <div className="regex-input-section mb-6 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/80 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all shadow-sm shadow-black/20 flex items-center px-4 py-3">
        <span className="text-zinc-500 text-xl font-mono mr-2">/</span>
        <input 
          type="text" 
          value={regexStr}
          onChange={(e) => setRegexStr(e.target.value)}
          aria-label="Regular Expression"
          placeholder="Enter regular expression..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-lg placeholder:text-zinc-700"
        />
        <span className="text-zinc-500 text-xl font-mono mx-2">/</span>
        <input 
          type="text" 
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          aria-label="Regular Expression Flags"
          placeholder="gim"
          className="w-16 bg-transparent border-none outline-none text-blue-400 font-mono text-lg"
        />
      </div>

      {errorMsg && (
        <div role="alert" aria-live="assertive" className="mb-6 text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg border border-red-400/20">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* 雙欄編輯區 (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* 左側：Test String */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all shadow-xl h-[450px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
            <label htmlFor="test-string-input" className="text-sm font-medium text-zinc-200">Test String</label>
            <button 
              onClick={() => setTestString("")}
              aria-label="Clear Test String"
              className="text-xs text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
            >
              Clear
            </button>
          </div>
          <textarea
            id="test-string-input"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Type your test string here..."
            className="flex-1 w-full bg-zinc-950/40 focus:bg-zinc-900/60 shadow-inner shadow-black/50 p-5 text-zinc-200 placeholder:text-zinc-600 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed transition-colors"
          />
        </div>

        {/* 右側：Match Results */}
        <div className="tool-panel flex flex-col gap-6">
          
          {/* 高亮預覽 */}
          <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl min-h-[200px]">
             <div className="flex px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
               <span className="text-sm font-medium text-zinc-200">Highlighted Matches</span>
             </div>
             <div className="p-5 bg-zinc-950/50 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words h-full">
               {renderHighlightedText()}
             </div>
          </div>

          {/* Matches 詳細資料 */}
          <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex-1 max-h-[226px]">
             <div className="flex px-4 py-3 border-b border-zinc-800 bg-zinc-800/40">
               <span className="text-sm font-medium text-zinc-200">
                 Match Groups <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">{matches.length} results</span>
               </span>
             </div>
             <div className="p-4 bg-zinc-950/50 overflow-y-auto">
               {matches.length > 0 ? (
                 <div className="space-y-4">
                   {matches.map((match, idx) => (
                     <div key={idx} className="text-sm">
                       <div className="text-zinc-400 mb-1">Match {idx + 1}</div>
                       <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-md p-2 font-mono text-blue-300">
                         {match[0]}
                       </div>
                       {match.length > 1 && (
                         <div className="mt-2 pl-2 border-l-2 border-zinc-700 space-y-1">
                           {Array.from(match).slice(1).map((group, gIdx) => (
                             <div key={gIdx} className="flex gap-2">
                               <span className="text-zinc-500">Group {gIdx + 1}:</span>
                               <span className="text-zinc-300 font-mono">{group}</span>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-zinc-600 text-sm italic">No matches found.</p>
               )}
             </div>
          </div>

        </div>

      </div>

      {/* RegExp Cheat Sheet Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-800/40">
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                RegExp Cheat Sheet
              </h2>
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-700/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6 text-sm text-zinc-300">
                <section>
                  <h3 className="text-zinc-100 font-medium mb-2 pb-1 border-b border-zinc-800">Character Classes (字元類別)</h3>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div><span className="text-blue-400">.</span> - Any character except newline</div>
                    <div><span className="text-blue-400">\w</span> - Word character [a-zA-Z0-9_]</div>
                    <div><span className="text-blue-400">\d</span> - Digit [0-9]</div>
                    <div><span className="text-blue-400">\s</span> - Whitespace (space, tab, etc.)</div>
                    <div><span className="text-blue-400">\W</span> - Not a word character</div>
                    <div><span className="text-blue-400">\D</span> - Not a digit</div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-zinc-100 font-medium mb-2 pb-1 border-b border-zinc-800">Quantifiers (數量詞)</h3>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div><span className="text-blue-400">*</span> - 0 or more</div>
                    <div><span className="text-blue-400">+</span> - 1 or more</div>
                    <div><span className="text-blue-400">?</span> - 0 or 1</div>
                    <div><span className="text-blue-400">&#123;3&#125;</span> - Exactly 3</div>
                    <div><span className="text-blue-400">&#123;3,&#125;</span> - 3 or more</div>
                    <div><span className="text-blue-400">&#123;3,5&#125;</span> - 3, 4, or 5</div>
                  </div>
                </section>

                <section>
                  <h3 className="text-zinc-100 font-medium mb-2 pb-1 border-b border-zinc-800">Anchors (邊界)</h3>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div><span className="text-blue-400">^</span> - Start of string/line</div>
                    <div><span className="text-blue-400">$</span> - End of string/line</div>
                    <div><span className="text-blue-400">\b</span> - Word boundary</div>
                    <div><span className="text-blue-400">\B</span> - Not a word boundary</div>
                  </div>
                </section>

                <section>
                  <h3 className="text-zinc-100 font-medium mb-2 pb-1 border-b border-zinc-800">Groups (群組)</h3>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                    <div><span className="text-blue-400">(abc)</span> - Capture group (抓取 abc)</div>
                    <div><span className="text-blue-400">(?:abc)</span> - Non-capturing group (不抓取)</div>
                    <div><span className="text-blue-400">[abc]</span> - Any of a, b, or c</div>
                    <div><span className="text-blue-400">[^abc]</span> - Not a, b, or c</div>
                    <div><span className="text-blue-400">a|b</span> - Match a OR b</div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-zinc-100 font-medium mb-2 pb-1 border-b border-zinc-800">Flags (修飾符)</h3>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                    <div><span className="text-blue-400">g</span> - Global (找尋全部匹配，不只第一個)</div>
                    <div><span className="text-blue-400">i</span> - Ignore case (忽略大小寫)</div>
                    <div><span className="text-blue-400">m</span> - Multiline (^ 和 $ 匹配每一行的開頭/結尾)</div>
                  </div>
                </section>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900 text-right">
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
