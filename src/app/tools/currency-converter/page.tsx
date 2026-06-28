"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";

const POPULAR_CURRENCIES = [
  "TWD", "USD", "JPY", "EUR", "GBP", "KRW", "AUD", "CAD", "CNY", "HKD", "SGD"
];

const CURRENCY_NAMES: Record<string, string> = {
  TWD: "新台幣", USD: "美元", JPY: "日圓", EUR: "歐元", GBP: "英鎊", 
  KRW: "韓元", AUD: "澳幣", CAD: "加幣", CNY: "人民幣", HKD: "港幣", 
  SGD: "新加坡幣", THB: "泰銖", MYR: "馬來西亞令吉", IDR: "印尼盾", PHP: "菲律賓比索",
  VND: "越南盾", INR: "印度盧比", CHF: "瑞士法郎", NZD: "紐西蘭幣", ZAR: "南非幣"
};

export default function CurrencyConverterPage() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("TWD");
  const [convertedAmount, setConvertedAmount] = useState<string>("0");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        // 結合兩者：Frankfurter (高頻歐洲央行) + ExchangeRate-API (支援更廣，含 TWD)
        const [frankRes, exRes] = await Promise.all([
          fetch("https://api.frankfurter.app/latest?from=USD").catch(() => null),
          fetch("https://api.exchangerate-api.com/v4/latest/USD").catch(() => null)
        ]);

        if ((!frankRes || !frankRes.ok) && (!exRes || !exRes.ok)) {
          throw new Error("Failed to fetch rates from all sources.");
        }

        let mergedRates: Record<string, number> = { USD: 1 };
        
        if (exRes && exRes.ok) {
          const exData = await exRes.json();
          mergedRates = { ...mergedRates, ...exData.rates };
        }
        
        if (frankRes && frankRes.ok) {
          const frankData = await frankRes.json();
          // Frankfurter 優先覆蓋（因資料來源為 ECB）
          mergedRates = { ...mergedRates, ...frankData.rates };
        }

        setRates(mergedRates);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load exchange rates.");
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (Object.keys(rates).length === 0) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setConvertedAmount("0.00");
      return;
    }
    
    // Convert logic: (amount / fromRate) * toRate
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    if (fromRate && toRate) {
      const result = (numAmount / fromRate) * toRate;
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-full p-6 sm:p-12 md:p-20 max-w-4xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-10 flex flex-col items-start gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">Currency Converter</h1>
        <div className="space-y-3">
          <p className="text-zinc-400">
            即時計算多國貨幣匯率。採用最新的公開匯率資料，方便出國旅遊、跨境購物與投資理財換算。
          </p>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-zinc-500">
            <span>Data source:</span>
            <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
              Frankfurter (ECB)
            </a>
            <span className="text-zinc-600">&</span>
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
              ExchangeRate-API
            </a>
          </div>
        </div>
      </div>

      {/* 內容區塊 - Premium Stacked UI */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto">
        <div className="relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-1">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-zinc-500 animate-pulse">
              載入匯率資料中...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-24 text-red-400/80">
              {error}
            </div>
          ) : (
            <>
              {/* Top Block: From */}
              <div className="relative bg-zinc-950/40 rounded-[22px] p-6 sm:p-8 transition-colors focus-within:bg-zinc-900/60 focus-within:ring-1 focus-within:ring-white/10 group">
                <label className="block text-sm font-medium text-zinc-500 mb-4 group-focus-within:text-zinc-400 transition-colors">
                  Amount
                </label>
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-4xl sm:text-5xl font-light text-zinc-100 placeholder:text-zinc-700 min-w-0 tracking-tight"
                    placeholder="0"
                    min="0"
                  />
                  <div className="relative shrink-0">
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="appearance-none bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-100 rounded-full px-5 py-2.5 pr-10 text-lg font-medium outline-none cursor-pointer border border-zinc-700/50 shadow-sm"
                    >
                      {POPULAR_CURRENCIES.map(c => (
                        <option key={c} value={c}>{c} {CURRENCY_NAMES[c] ? `- ${CURRENCY_NAMES[c]}` : ""}</option>
                      ))}
                      <option disabled>────────</option>
                      {Object.keys(rates).filter(c => !POPULAR_CURRENCIES.includes(c)).sort().map(c => (
                        <option key={c} value={c}>{c} {CURRENCY_NAMES[c] ? `- ${CURRENCY_NAMES[c]}` : ""}</option>
                      ))}
                    </select>
                    {/* 自訂箭頭 */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Swap Button */}
              <div className="relative h-1 w-full flex items-center justify-center z-10">
                <div className="absolute w-full h-[1px] bg-zinc-800/50"></div>
                <button
                  onClick={handleSwap}
                  aria-label="Swap currencies"
                  className="relative flex items-center justify-center w-12 h-12 bg-zinc-800 text-zinc-300 hover:text-white rounded-full border-4 border-zinc-900 hover:bg-zinc-700 hover:scale-105 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Block: To */}
              <div className="relative bg-zinc-900/30 rounded-[22px] p-6 sm:p-8 mt-1 transition-colors">
                <label className="block text-sm font-medium text-zinc-500 mb-4">
                  Converted
                </label>
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={convertedAmount}
                    readOnly
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-4xl sm:text-5xl font-light text-blue-400 min-w-0 tracking-tight"
                  />
                  <div className="relative shrink-0">
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="appearance-none bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-100 rounded-full px-5 py-2.5 pr-10 text-lg font-medium outline-none cursor-pointer border border-zinc-700/50 shadow-sm"
                    >
                      {POPULAR_CURRENCIES.map(c => (
                        <option key={c} value={c}>{c} {CURRENCY_NAMES[c] ? `- ${CURRENCY_NAMES[c]}` : ""}</option>
                      ))}
                      <option disabled>────────</option>
                      {Object.keys(rates).filter(c => !POPULAR_CURRENCIES.includes(c)).sort().map(c => (
                        <option key={c} value={c}>{c} {CURRENCY_NAMES[c] ? `- ${CURRENCY_NAMES[c]}` : ""}</option>
                      ))}
                    </select>
                    {/* 自訂箭頭 */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rate Info & Footer */}
        {!loading && !error && rates[fromCurrency] && rates[toCurrency] && (
          <div className="mt-8 flex flex-col items-center text-sm text-zinc-500 space-y-2">
            <div className="px-4 py-1.5 bg-zinc-900/50 border border-zinc-800/80 rounded-full font-mono flex items-center gap-2">
              <span className="text-zinc-400">1 {fromCurrency}</span>
              <span>=</span>
              <span className="text-blue-400">
                {(rates[toCurrency] / rates[fromCurrency]).toFixed(6)} {toCurrency}
              </span>
            </div>
            <p className="text-xs text-zinc-600">
              Exchange rates updated based on latest daily data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
