import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "線上 Base64 編碼/解碼工具 | litool",
  description: "快速進行文字的 Base64 編碼與解碼。純前端運算，資料不留存伺服器，安全且極速。",
  keywords: ["Base64 編碼", "Base64 解碼", "Base64 encoder", "Base64 decoder", "文字編碼"],
  alternates: {
    canonical: "/tools/base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
