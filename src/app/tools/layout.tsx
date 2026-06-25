import React from "react";
import FeedbackCTA from "@/components/FeedbackCTA";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-full w-full">
      {/* 工具主要內容 */}
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>
      
      {/* 全域工具頁專屬的回報 Bug / 許願區塊 */}
      <FeedbackCTA />
    </div>
  );
}
