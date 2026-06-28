import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to TS Interface 轉換器",
  description: "線上將 JSON 結構一鍵轉換為強型別的 TypeScript Interface。支援巢狀物件與陣列推導，並具備 VS Code 語法高亮與自動排版功能，提升前端開發效率。",
  keywords: ["JSON to TS", "JSON to TypeScript", "TypeScript Interface", "型別產生器", "前端開發", "線上工具", "litool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
