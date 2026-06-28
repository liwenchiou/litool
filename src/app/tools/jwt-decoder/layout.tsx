import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder 解析器",
  description: "安全且快速地解析 JSON Web Token (JWT)。純前端本地端解碼，不傳送資料至伺服器，即時檢視 Payload 與過期時間。",
  keywords: ["JWT Decoder", "JWT 解析", "JSON Web Token", "前端工具", "資安", "線上工具", "litool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
