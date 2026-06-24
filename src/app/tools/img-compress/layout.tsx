import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "線上圖片壓縮工具 (支援批次、免上傳) | litool",
  description: "免費且安全的純前端圖片壓縮工具。支援多圖批次處理、Instagram/LINE/Facebook 專屬尺寸優化，圖片絕不上傳伺服器，保護您的隱私。",
  keywords: ["圖片壓縮", "線上壓縮圖片", "照片縮小", "IG尺寸", "批次壓縮", "純前端壓縮"],
  alternates: {
    canonical: "/tools/img-compress",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
