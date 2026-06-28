"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileCode2, Copy, Check, Wand2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function JsonToTsPage() {
  const [jsonInput, setJsonInput] = useState('{\n  "id": 1,\n  "name": "Litool",\n  "isActive": true,\n  "tags": ["utility", "web"],\n  "metadata": {\n    "version": "1.0.0"\n  }\n}');
  const [tsOutput, setTsOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (!jsonInput.trim()) {
        setTsOutput("");
        setError("");
        return;
      }
      const parsed = JSON.parse(jsonInput);
      const interfaces: string[] = [];
      const seenInterfaces = new Set<string>();

      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

      const getType = (value: any, keyName: string): string => {
        if (value === null) return "any";
        if (Array.isArray(value)) {
          if (value.length === 0) return "any[]";
          const elemType = getType(value[0], keyName + "Item");
          // If the element is an object and generated an interface, just use interfaceName[]
          // Wait, simple logic:
          return `${elemType}[]`;
        }
        if (typeof value === "object") {
          const interfaceName = capitalize(keyName);
          generateInterface(value, interfaceName);
          return interfaceName;
        }
        return typeof value;
      };

      const generateInterface = (obj: Record<string, any>, name: string) => {
        if (seenInterfaces.has(name)) return;
        seenInterfaces.add(name);

        let props = "";
        for (const [key, value] of Object.entries(obj)) {
          // ensure valid TS property name
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
          const typeStr = getType(value, key);
          props += `  ${safeKey}: ${typeStr};\n`;
        }

        const interfaceStr = `export interface ${name} {\n${props}}`;
        interfaces.push(interfaceStr);
      };

      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        generateInterface(parsed, "Root");
      } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
        generateInterface(parsed[0], "RootItem");
      } else {
        throw new Error("JSON root must be an object or an array of objects.");
      }

      setTsOutput(interfaces.reverse().join("\n\n"));
      setError("");
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
      setTsOutput("");
    }
  }, [jsonInput]);

  const copyToClipboard = () => {
    if (!tsOutput) return;
    navigator.clipboard.writeText(tsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError("Cannot format invalid JSON");
    }
  };

  return (
    <div className="min-h-full p-6 sm:p-12 md:p-20 max-w-6xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-10 flex flex-col items-start gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <FileCode2 className="w-8 h-8 text-emerald-400" />
          JSON to TypeScript
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          貼上 JSON 結構，瞬間自動產生具備強型別的 TypeScript Interface。支援巢狀物件與陣列自動推導。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: JSON Input */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all shadow-xl">
          <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-800 bg-zinc-800/40">
            <label className="text-sm font-medium text-zinc-200">JSON Input</label>
            <div className="flex items-center gap-3">
              {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
              <button 
                onClick={formatJson}
                className="text-xs flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
              >
                <Wand2 className="w-3.5 h-3.5" /> Format
              </button>
            </div>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-zinc-950/40 focus:bg-zinc-900/60 shadow-inner shadow-black/50 p-6 text-zinc-300 placeholder:text-zinc-700 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed transition-colors min-h-[400px]"
          />
        </div>

        {/* Right: TS Output */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-800 bg-zinc-800/40">
            <label className="text-sm font-medium text-emerald-400">TypeScript Interfaces</label>
            <button 
              onClick={copyToClipboard}
              disabled={!tsOutput}
              className="text-xs flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-md hover:bg-emerald-500/20 border border-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
            </button>
          </div>
          <div className="flex-1 bg-[#1E1E1E] overflow-auto rounded-b-2xl">
            {tsOutput ? (
              <SyntaxHighlighter 
                language="typescript" 
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem' }}
              >
                {tsOutput}
              </SyntaxHighlighter>
            ) : (
              <div className="p-6 text-sm text-zinc-600 font-mono">Waiting for valid JSON...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
