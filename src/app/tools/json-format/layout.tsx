import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "線上 JSON 格式化與驗證工具 | litool",
  description: "開發者必備的線上 JSON 格式化工具。提供語法高亮、錯誤驗證、摺疊展開與壓縮功能，純前端運行，極速解析。",
  keywords: ["JSON 格式化", "JSON formatter", "JSON 驗證", "JSON parser", "JSON minify"],
  alternates: {
    canonical: "/tools/json-format",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
