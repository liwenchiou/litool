import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "隱私權政策 - litool",
  description: "litool 開發者與日常工具箱的隱私權政策說明。",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-24 w-full animate-fade-in-up">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group mb-8">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        返回首頁
      </Link>
      
      <h1 className="text-3xl font-bold text-white mb-2">隱私權政策</h1>
      <p className="text-zinc-500 mb-10">最後更新日期：2026年6月</p>

      <div className="space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">1. 資料收集與處理原則</h2>
          <p>
            litool 是一個注重效能與隱私的純前端靜態工具箱。我們<strong>不會</strong>在伺服器端儲存、攔截或分析您輸入的任何原始資料（如 JSON、圖片、Base64 字串等）。所有的資料處理、轉換與運算，皆完全在您的瀏覽器（Client-side）本地執行。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">2. 第三方服務與 Cookie</h2>
          <p>
            為了改善網站效能與使用者體驗，我們可能會使用 Google Analytics 或類似的匿名分析工具來收集基本的流量數據（如造訪頁面、設備類型等）。這些工具可能會在您的瀏覽器中寫入 Cookie。您可以隨時透過瀏覽器設定來禁用 Cookie。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">3. 外部連結</h2>
          <p>
            本網站可能包含指向其他外部網站的連結（如 GitHub、作者個人網站等）。這些外部網站有其各自的隱私權政策，當您點擊離開本網站時，我們無法為該網站的隱私權保護與內容負責。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">4. 隱私權政策的修改</h2>
          <p>
            我們保留隨時修改本隱私權政策的權利。修改後的條款將直接發布於本頁面，並更新最上方的「最後更新日期」。建議您定期回顧本頁面以確保了解最新的隱私權規範。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">5. 聯絡我們</h2>
          <p>
            若您對本隱私權政策有任何疑問，歡迎來信至：<a href="mailto:service@liwen.studio" className="text-blue-400 hover:underline">service@liwen.studio</a>。
          </p>
        </section>
      </div>
    </div>
  );
}
