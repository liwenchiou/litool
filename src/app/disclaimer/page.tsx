import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "免責聲明 - litool",
  description: "litool 開發者與日常工具箱的免責聲明。",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-24 w-full animate-fade-in-up">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group mb-8">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        返回首頁
      </Link>
      
      <h1 className="text-3xl font-bold text-white mb-2">免責聲明</h1>
      <p className="text-zinc-500 mb-10">最後更新日期：2026年6月</p>

      <div className="space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">1. 服務現狀與風險承擔</h2>
          <p>
            litool 提供的所有工具與功能皆依「現狀（As is）」及「現有（As available）」基礎提供。我們不對本網站工具的準確性、完整性、安全性或適用性做任何明示或暗示的保證。使用者在使用本網站工具時，須自行承擔所有風險。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">2. 資料遺失與損害賠償</h2>
          <p>
            雖然我們的工具全在您的瀏覽器本地端執行，但我們仍強烈建議您在進行任何重要的資料轉換（如 JSON 格式化、圖片壓縮）前，自行備份原始檔案。因使用本網站服務而導致的任何直接、間接、偶發或衍生性的資料遺失或損害，我們概不負責。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">3. 服務變更與中斷</h2>
          <p>
            我們保留在沒有事前通知的情況下，隨時修改、暫停或永久終止本網站部分或全部服務的權利。對於因服務變更或中斷所造成的任何不便或損失，我們不承擔任何責任。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">4. 第三方版權與開源協議</h2>
          <p>
            本網站可能使用或引用了第三方的開源專案與函式庫。所有第三方程式碼的版權均歸其原作者所有，請遵守其對應的開源授權條款。若您發現本網站內容有任何侵權疑慮，請與我們聯繫，我們將盡速處理。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">5. 聯絡方式</h2>
          <p>
            如有任何關於本免責聲明的疑問或合作提案，請來信至：<a href="mailto:service@liwen.studio" className="text-blue-400 hover:underline">service@liwen.studio</a>。
          </p>
        </section>
      </div>
    </div>
  );
}
