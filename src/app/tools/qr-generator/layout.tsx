import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator 產生器",
  description: "即時將文字、網址轉換為高解析度 QR Code。純前端無伺服器處理，支援一鍵下載為 PNG 圖片，保護資料隱私。",
  keywords: ["QR Code Generator", "QR Code 產生器", "二維碼產生", "線上工具", "litool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
