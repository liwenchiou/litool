import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "正則表達式測試工具 (RegExp Tester) | litool",
  description: "開發者專用的線上正規表達式 (Regex) 測試工具。提供即時語法高亮、匹配結果預覽以及常用的 Regex 語法速查表 (Cheat Sheet)。",
  keywords: ["RegExp 測試", "正則表達式", "Regex tester", "正規表示式", "Regex cheat sheet"],
  alternates: {
    canonical: "/tools/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
