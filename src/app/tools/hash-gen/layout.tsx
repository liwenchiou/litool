import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "線上 Hash 雜湊產生器 (MD5/SHA-256) | litool",
  description: "支援 MD5, SHA-1, SHA-256, SHA-512, SHA-3 等多種演算法的文字雜湊產生器。採用 CryptoJS，純前端安全運算。",
  keywords: ["Hash generator", "MD5 產生器", "SHA-256 產生器", "雜湊產生器", "加密工具"],
  alternates: {
    canonical: "/tools/hash-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
