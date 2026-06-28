"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Key } from "lucide-react";

interface JwtData {
  header: any;
  payload: any;
  isValid: boolean;
  error?: string;
  isExpired?: boolean;
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4OTM0NTYwMDB9.dummy_signature_just_for_parsing");
  const [decoded, setDecoded] = useState<JwtData | null>(null);

  // Parse JWT
  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null);
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Must contain 3 parts separated by dots.");
      }

      const decodeBase64Url = (str: string) => {
        // Handle Base64Url to standard Base64
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        if (pad) {
          if (pad === 1) throw new Error("Invalid base64 string.");
          base64 += new Array(5 - pad).join("=");
        }
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      };

      const header = decodeBase64Url(parts[0]);
      const payload = decodeBase64Url(parts[1]);
      
      // Check Expiration
      let isExpired = false;
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        isExpired = currentTime > payload.exp;
      }

      setDecoded({
        header,
        payload,
        isValid: true,
        isExpired
      });
    } catch (err: any) {
      setDecoded({
        header: null,
        payload: null,
        isValid: false,
        error: err.message || "Failed to parse JWT."
      });
    }
  }, [token]);

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
          <Key className="w-8 h-8 text-indigo-400" />
          JWT Decoder
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          安全地在本地端解析 JSON Web Token (JWT)。資料絕不會傳送至任何伺服器，適合用於開發除錯。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Input Token */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all shadow-xl">
          <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-800 bg-zinc-800/40">
            <label htmlFor="jwt-input" className="text-sm font-medium text-zinc-200">Encoded Token</label>
            <button 
              onClick={() => setToken("")}
              className="text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded-md hover:bg-zinc-700 border border-zinc-700/50"
            >
              Clear
            </button>
          </div>
          <textarea
            id="jwt-input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="flex-1 w-full bg-zinc-950/40 focus:bg-zinc-900/60 shadow-inner shadow-black/50 p-6 text-zinc-300 placeholder:text-zinc-700 resize-none outline-none focus:ring-0 font-mono text-sm leading-relaxed transition-colors break-all min-h-[300px]"
          />
        </div>

        {/* Right Column: Decoded Output */}
        <div className="flex flex-col gap-6">
          {/* Status Indicator */}
          {token && (
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${
              decoded?.isValid 
                ? decoded.isExpired 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}>
              {decoded?.isValid ? (
                decoded.isExpired ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
              <span className="font-medium text-sm">
                {!decoded?.isValid && "Invalid Signature / Format"}
                {decoded?.isValid && decoded.isExpired && "Token is Expired"}
                {decoded?.isValid && !decoded.isExpired && "Valid JWT Format"}
              </span>
            </div>
          )}

          {/* Header Block */}
          <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
            <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-800/40 text-sm font-medium text-rose-400">
              Header (Algorithm & Type)
            </div>
            <div className="flex-1 p-5 bg-zinc-950/50 overflow-auto">
              <pre className="font-mono text-sm text-zinc-300">
                {decoded?.isValid ? JSON.stringify(decoded.header, null, 2) : (decoded?.error ? "Error" : "{}")}
              </pre>
            </div>
          </div>

          {/* Payload Block */}
          <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[250px]">
            <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-800/40 text-sm font-medium text-indigo-400">
              Payload (Data)
            </div>
            <div className="flex-1 p-5 bg-zinc-950/50 overflow-auto">
              <pre className="font-mono text-sm text-zinc-300">
                {decoded?.isValid ? JSON.stringify(decoded.payload, null, 2) : (decoded?.error ? "Error" : "{}")}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
