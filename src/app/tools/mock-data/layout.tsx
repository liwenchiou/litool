import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Data Generator 假資料產生器",
  description: "開發測試必備！一鍵快速產生大量擬真測試資料（支援 JSON 格式匯出）。可自訂欄位類型如人名、信箱、UUID，純前端運算安全無隱私疑慮。",
  keywords: ["假資料產生器", "Mock Data", "JSON 產生器", "測試資料", "Test Data Generator", "前端開發", "線上工具", "litool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
