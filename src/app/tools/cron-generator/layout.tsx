import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Job Generator 排程語法產生器",
  description: "快速設定與翻譯 Linux Cron Job 排程語法。提供視覺化下拉選單、常用預設值與即時白話文翻譯，讓你不再死背 Cron 字串。",
  keywords: ["Cron Job", "Crontab", "排程產生器", "排程設定", "Linux", "Cron 翻譯", "線上工具", "litool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
