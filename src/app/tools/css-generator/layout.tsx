import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Shadow Generator 陰影產生器",
  description: "視覺化調整 Box Shadow 區塊陰影，拖曳滑桿即時預覽效果。支援匯出原生 CSS 語法與 Tailwind CSS 的 Arbitrary Value。",
  keywords: ["CSS Shadow", "Box Shadow", "陰影產生器", "Tailwind CSS", "CSS 工具", "視覺化工具", "litool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
