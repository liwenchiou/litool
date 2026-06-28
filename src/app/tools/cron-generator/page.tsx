"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Copy, Check } from "lucide-react";

export default function CronGeneratorPage() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");

  const [copied, setCopied] = useState(false);

  const cronString = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  // 簡易白話文翻譯邏輯 (可視需求進一步完善，此為 MVP 版本)
  const describeCron = () => {
    let desc = "在 ";
    
    if (dayOfWeek !== "*") desc += `每週的第 ${dayOfWeek} 天 `;
    if (month !== "*") desc += `第 ${month} 個月 `;
    if (dayOfMonth !== "*") desc += `第 ${dayOfMonth} 號 `;
    if (dayOfWeek === "*" && month === "*" && dayOfMonth === "*") desc += "每一天 ";

    if (hour !== "*") desc += `的 ${hour} 點 `;
    else desc += "的每小時 ";

    if (minute !== "*") {
       if (minute.includes("*/")) {
           desc += `每 ${minute.split("/")[1]} 分鐘執行一次`;
       } else {
           desc += `第 ${minute} 分執行`;
       }
    } else {
       desc += "每分鐘執行";
    }

    // 處理特例： * * * * *
    if (cronString === "* * * * *") return "每一分鐘執行一次";
    // 處理特例： 0 * * * *
    if (cronString === "0 * * * *") return "每小時整點執行一次";
    // 處理特例： 0 0 * * *
    if (cronString === "0 0 * * *") return "每天午夜 (00:00) 執行一次";
    
    return desc + "。";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PresetButton = ({ label, exp }: { label: string, exp: string }) => {
    const applyPreset = () => {
      const parts = exp.split(" ");
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    };
    return (
      <button 
        onClick={applyPreset}
        className="px-4 py-2 bg-zinc-800 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
      >
        {label}
      </button>
    );
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
          <Clock className="w-8 h-8 text-purple-400" />
          Cron Job Generator
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          快速產生與翻譯 Cron 排程語法，不用再死背星號代表什麼意思了。
        </p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Output & Description Box */}
        <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-50"></div>
          
          <h2 className="text-5xl sm:text-7xl font-mono text-zinc-100 mb-6 tracking-widest font-bold">
            {cronString}
          </h2>
          <p className="text-xl text-purple-300 font-medium bg-purple-500/10 px-6 py-2 rounded-full border border-purple-500/20">
            {describeCron()}
          </p>
          
          <button 
            onClick={copyToClipboard}
            className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-full transition-all active:scale-95 shadow-lg"
          >
            {copied ? <><Check className="w-4 h-4" /> 已複製</> : <><Copy className="w-4 h-4" /> 複製語法</>}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-zinc-500 ml-1">常用設定 (Presets)</h3>
          <div className="flex flex-wrap gap-2">
            <PresetButton label="每一分鐘" exp="* * * * *" />
            <PresetButton label="每 5 分鐘" exp="*/5 * * * *" />
            <PresetButton label="每小時整點" exp="0 * * * *" />
            <PresetButton label="每天午夜" exp="0 0 * * *" />
            <PresetButton label="每週一早上 8 點" exp="0 8 * * 1" />
            <PresetButton label="每月一號午夜" exp="0 0 1 * *" />
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Minute", val: minute, set: setMinute, ph: "0-59" },
            { label: "Hour", val: hour, set: setHour, ph: "0-23" },
            { label: "Day", val: dayOfMonth, set: setDayOfMonth, ph: "1-31" },
            { label: "Month", val: month, set: setMonth, ph: "1-12" },
            { label: "Weekday", val: dayOfWeek, set: setDayOfWeek, ph: "0-6 (Sun-Sat)" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">{item.label}</label>
              <input 
                type="text" 
                value={item.val}
                onChange={(e) => item.set(e.target.value)}
                placeholder={item.ph}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 font-mono text-center shadow-inner"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
