"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  format,
  parseISO,
  differenceInDays,
  differenceInBusinessDays,
  differenceInMonths,
  differenceInYears,
  add,
  sub,
  isValid
} from "date-fns";
// @ts-ignore
import { Lunar } from "lunar-javascript";

export default function DateCalculatorPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 避免 Hydration Mismatch，初始值給空，在 useEffect 中設定為今天
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [baseDate, setBaseDate] = useState("");
  const [amount, setAmount] = useState(7);
  const [operation, setOperation] = useState<"add" | "sub">("add");
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const nextWeek = format(add(new Date(), { days: 7 }), "yyyy-MM-dd");
    setStartDate(today);
    setEndDate(nextWeek);
    setBaseDate(today);
  }, []);
  // === 計算兩日期間距 ===
  const renderDifference = () => {
    if (!startDate || !endDate) return null;
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) return <div className="text-zinc-500">無效的日期格式</div>;

    // 確保 end >= start，否則調換
    const isNegative = start > end;
    const d1 = isNegative ? end : start;
    const d2 = isNegative ? start : end;

    const days = differenceInDays(d2, d1);
    const bizDays = differenceInBusinessDays(d2, d1);
    const months = differenceInMonths(d2, d1);
    const years = differenceInYears(d2, d1);

    return (
      <div className="space-y-4">
        {isNegative && <p className="text-sm text-amber-400/80 mb-2">開始日期晚於結束日期，目前顯示絕對差值。</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">{days}</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">總天數</div>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{bizDays}</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">工作日 (一至五)</div>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-zinc-200 mb-1">{months}</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">相隔月數</div>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-zinc-200 mb-1">{years}</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">相隔年數</div>
          </div>
        </div>
      </div>
    );
  };

  // === 計算加減日期結果 ===
  const renderAddSubResult = () => {
    if (!baseDate) return null;
    const base = parseISO(baseDate);
    if (!isValid(base)) return <div className="text-zinc-500">無效的日期格式</div>;

    const duration = { [unit]: amount };
    const resultDate = operation === "add" ? add(base, duration) : sub(base, duration);

    // 把 date-fns 的 format 結果中文化 (星期幾需自行對應，或用中文 Locale。這裡用簡單替換)
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDayStr = weekDays[resultDate.getDay()];

    // 民國曆
    const rocYear = resultDate.getFullYear() - 1911;
    const rocString = `民國 ${rocYear} 年 ${resultDate.getMonth() + 1} 月 ${resultDate.getDate()} 日`;

    // 農曆
    const lunar = Lunar.fromDate(resultDate);
    const lunarString = `農曆 ${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;

    // 替換 renderAddSubResult 的 return 區塊
    return (
      <div className="mt-6 space-y-3">
        
        {/* 西曆 */}
        <div className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center text-zinc-300 font-medium">
              西曆
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-zinc-200">西元</div>
              <div className="text-xs text-zinc-500">{weekDayStr}</div>
            </div>
          </div>
          <div className="text-left sm:text-right pl-12 sm:pl-0">
            <div className="text-xl font-bold text-white tracking-wide">
              {format(resultDate, "yyyy 年 MM 月 dd 日")}
            </div>
          </div>
        </div>

        {/* 民國 */}
        <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium">
              民國
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-blue-300/90">台灣曆法</div>
              <div className="text-xs text-blue-500/60">ROC Era</div>
            </div>
          </div>
          <div className="text-left sm:text-right pl-12 sm:pl-0">
            <div className="text-xl font-bold text-blue-400 tracking-wide">
              {rocYear} 年 {resultDate.getMonth() + 1} 月 {resultDate.getDate()} 日
            </div>
          </div>
        </div>

        {/* 農曆 */}
        <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-medium">
              農曆
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-emerald-300/90">傳統曆法</div>
              <div className="text-xs text-emerald-500/60">Lunar Calendar</div>
            </div>
          </div>
          <div className="text-left sm:text-right pl-12 sm:pl-0">
            <div className="text-xl font-bold text-emerald-400 tracking-wide">
              {lunar.getYearInGanZhi()}年 {lunar.getMonthInChinese()}月{lunar.getDayInChinese()}
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div ref={containerRef} className="min-h-full p-6 sm:p-12 md:p-20 max-w-6xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-10 flex flex-col items-start gap-4">

        <h1 className="text-3xl font-bold tracking-tight text-white">Date Calculator</h1>
        <div className="space-y-3">
          <p className="text-zinc-400">
            精準計算日期區間、工作日天數，或快速推算未來的特定日期。
          </p>
          <div className="flex items-start sm:items-center gap-2 text-sm text-amber-200/90 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20 inline-block shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="text-amber-400 font-semibold whitespace-nowrap">💡 提示：</span>
            左邊可以用來算「距離某個日子還有幾天/幾個工作日」，右邊可以推算「90天後的日期是哪一天」。
          </div>
        </div>
      </div>

      {/* 雙欄編輯區 (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">

        {/* 左側：Date Difference */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center px-5 py-4 border-b border-zinc-800 bg-zinc-800/40">
            <h2 className="font-medium text-zinc-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              計算日期區間
            </h2>
          </div>
          <div className="p-6 space-y-6 flex-1 bg-zinc-950/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-date" className="text-sm font-medium text-zinc-300">開始日期</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/80 rounded-lg px-4 py-2.5 text-zinc-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all color-scheme-dark shadow-sm shadow-black/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end-date" className="text-sm font-medium text-zinc-300">結束日期</label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/80 rounded-lg px-4 py-2.5 text-zinc-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all color-scheme-dark shadow-sm shadow-black/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
              <h3 className="text-sm text-zinc-500 mb-4 tracking-wider">計算結果</h3>
              {renderDifference()}
            </div>
          </div>
        </div>

        {/* 右側：Add / Subtract Date */}
        <div className="tool-panel flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center px-5 py-4 border-b border-zinc-800 bg-zinc-800/40">
            <h2 className="font-medium text-zinc-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              推算未來 / 過去日期
            </h2>
          </div>
          <div className="p-6 space-y-6 flex-1 bg-zinc-950/30">

            <div className="space-y-2">
              <label htmlFor="base-date" className="text-sm font-medium text-zinc-300">基準日期</label>
              <input
                id="base-date"
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/80 rounded-lg px-4 py-2.5 text-zinc-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all color-scheme-dark shadow-sm shadow-black/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="operation" className="text-sm font-medium text-zinc-300">計算方式</label>
                <select
                  id="operation"
                  value={operation}
                  onChange={(e: any) => setOperation(e.target.value)}
                  className="w-full bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/80 rounded-lg px-3 py-2.5 text-zinc-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm shadow-black/20"
                >
                  <option value="add">加 (Add)</option>
                  <option value="sub">減 (Sub)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-zinc-300">數值</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/80 rounded-lg px-3 py-2.5 text-zinc-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm shadow-black/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="unit" className="text-sm font-medium text-zinc-300">單位</label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e: any) => setUnit(e.target.value)}
                  className="w-full bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/80 rounded-lg px-3 py-2.5 text-zinc-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm shadow-black/20"
                >
                  <option value="days">天</option>
                  <option value="weeks">週</option>
                  <option value="months">月</option>
                  <option value="years">年</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
              {renderAddSubResult()}
            </div>

          </div>
        </div>

      </div>

      {/* 為了修復 input[type="date"] 在深色模式下的 icon 顏色，我們可以用一點 global css 寫在這裡 */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .color-scheme-dark {
          color-scheme: dark;
        }
      `}} />
    </div>
  );
}
