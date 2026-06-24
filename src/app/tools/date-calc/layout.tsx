import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "線上日期計算機 (支援農曆/民國曆) | litool",
  description: "精準的日期推算工具。計算兩個日期之間的天數，或是推算加上/減去特定天數後的日期。自動顯示對應的西曆、民國曆與農曆。",
  keywords: ["日期計算", "農曆轉換", "民國曆轉換", "天數計算", "日期推算", "日曆工具"],
  alternates: {
    canonical: "/tools/date-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
