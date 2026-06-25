"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// 檔案大小格式化工具
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

type ImageItem = {
  id: string;
  originalFile: File;
  originalUrl: string;
  compressedFile: File | null;
  compressedUrl: string | null;
  status: 'pending' | 'compressing' | 'done' | 'error';
  errorMsg?: string;
};

export default function ImageCompressorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 壓縮參數 (簡化為情境模式)
  const [resizeMode, setResizeMode] = useState<"auto" | "instagram" | "facebook" | "line">("auto");

  // 釋放 ObjectURL 避免記憶體流失
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
        if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
      });
    };
  }, [images]);
  // 處理選擇檔案
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: ImageItem[] = files.filter(f => f.type.startsWith('image/')).map(file => ({
      id: Math.random().toString(36).substring(7) + Date.now(),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      compressedFile: null,
      compressedUrl: null,
      status: 'pending'
    }));

    if (files.length !== newItems.length) {
      setErrorMsg("部分檔案格式不支援，已自動略過非圖片檔。");
    } else {
      setErrorMsg(null);
    }
    
    setImages(prev => [...prev, ...newItems]);
    // 當有新檔案加入時，若原本已經壓縮完的可以保持，但新檔案就是 pending
  };

  const handleClearAll = () => {
    images.forEach(img => {
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setErrorMsg(null);
  };

  const handleRemoveItem = (id: string) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  // 執行壓縮
  const handleCompress = async () => {
    const itemsToCompress = images.filter(img => img.status === 'pending');
    if (itemsToCompress.length === 0) return;
    
    setIsCompressing(true);
    setErrorMsg(null);

    for (const item of itemsToCompress) {
      setImages(prev => prev.map(img => img.id === item.id ? { ...img, status: 'compressing' } : img));
      
      try {
        const originalMB = item.originalFile.size / 1024 / 1024;
        let maxDim = 1920;
        let targetMB = 1;
        let quality = 0.8;

        switch (resizeMode) {
          case "auto":
            maxDim = 1920; 
            targetMB = Math.min(1, originalMB * 0.5);
            quality = 0.7;
            break;
          case "instagram":
            maxDim = 1080; 
            targetMB = Math.min(0.5, originalMB * 0.6);
            quality = 0.8;
            break;
          case "facebook":
            maxDim = 1200; 
            targetMB = Math.min(0.8, originalMB * 0.6);
            quality = 0.8;
            break;
          case "line":
            maxDim = 800; 
            targetMB = Math.min(0.2, originalMB * 0.4);
            quality = 0.6;
            break;
        }

        const options = {
          maxSizeMB: targetMB,
          maxWidthOrHeight: maxDim,
          useWebWorker: true,
          initialQuality: quality,
        };
        
        const compressedBlob = await imageCompression(item.originalFile, options);
        const cFile = new File([compressedBlob], `compressed_${item.originalFile.name}`, {
          type: compressedBlob.type,
        });
        
        setImages(prev => prev.map(img => img.id === item.id ? {
          ...img,
          status: 'done',
          compressedFile: cFile,
          compressedUrl: URL.createObjectURL(cFile)
        } : img));

      } catch (error: any) {
        setImages(prev => prev.map(img => img.id === item.id ? {
          ...img,
          status: 'error',
          errorMsg: error.message || "壓縮失敗"
        } : img));
      }
    }

    setIsCompressing(false);
  };

  const handleDownloadZip = async () => {
    const doneItems = images.filter(img => img.status === 'done' && img.compressedFile);
    if (doneItems.length === 0) return;
    
    const zip = new JSZip();
    doneItems.forEach(item => {
      zip.file(`compressed_${item.originalFile.name}`, item.compressedFile!);
    });
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "compressed_images.zip");
  };

  return (
    <div ref={containerRef} className="min-h-full p-6 sm:p-12 md:p-20 max-w-6xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-10 flex flex-col items-start gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">圖片壓縮工具 (Image Compressor)</h1>
        <div className="space-y-3">
          <p className="text-zinc-400">
            純前端運算的圖片批次壓縮工具，圖片完全不會上傳到任何伺服器，支援多張圖片同時處理。
          </p>
          <div className="flex items-start sm:items-center gap-2 text-sm text-amber-200/90 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20 inline-block shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="text-amber-400 font-semibold whitespace-nowrap">💡 提示：</span>
            可一次選取多張圖片，選擇要發佈的社群平台情境，一鍵快速瘦身打包下載。
          </div>
        </div>
      </div>

      {errorMsg && (
        <div role="alert" aria-live="assertive" className="mb-6 text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg border border-red-400/20">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* 如果還沒選擇檔案，顯示大大的上傳區 */}
      {images.length === 0 ? (
        <div className="tool-panel flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-700/50 rounded-3xl bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-blue-500/50 transition-all group relative overflow-hidden min-h-[400px]">
          <input 
            type="file" 
            accept="image/*"
            multiple
            aria-label="上傳圖片檔案"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center text-zinc-500 group-hover:text-blue-400 transition-colors">
            <svg className="w-16 h-16 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-bold text-zinc-300 group-hover:text-blue-300 mb-2">點擊或選取多張圖片至此</h3>
            <p className="text-sm">支援 JPG, PNG, WebP 格式 (支援批次處理)</p>
          </div>
        </div>
      ) : (
        /* 如果選擇了檔案，顯示雙欄介面 */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* 左側：設定與操作區 */}
          <div className="tool-panel lg:col-span-4 flex flex-col gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl p-5">
              <h2 className="font-medium text-zinc-100 mb-4 pb-3 border-b border-zinc-800 flex items-center justify-between">
                壓縮設定
                <div className="flex gap-2">
                  <div className="relative overflow-hidden">
                    <button className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors relative z-0 pointer-events-none">
                      加入圖片
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      aria-label="加入更多圖片檔案"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                  <button 
                    onClick={handleClearAll}
                    className="text-xs px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors border border-red-500/20"
                  >
                    清空全部
                  </button>
                </div>
              </h2>
              
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">選擇壓縮尺寸與情境</label>
                  <div className="grid grid-cols-1 gap-2">
                    
                    <button 
                      onClick={() => setResizeMode("auto")}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${resizeMode === "auto" ? "bg-blue-500/20 border-blue-500/50" : "bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800"}`}
                    >
                      <div className={`text-sm font-bold ${resizeMode === "auto" ? "text-blue-400" : "text-zinc-300"}`}>智慧優化 (推薦)</div>
                      <div className="text-xs text-zinc-500 mt-1">程式自動判斷最佳壓縮率，保留最高畫質</div>
                    </button>

                    <button 
                      onClick={() => setResizeMode("instagram")}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${resizeMode === "instagram" ? "bg-blue-500/20 border-blue-500/50" : "bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800"}`}
                    >
                      <div className={`text-sm font-bold ${resizeMode === "instagram" ? "text-blue-400" : "text-zinc-300"}`}>Instagram (IG 貼文/限動)</div>
                      <div className="text-xs text-zinc-500 mt-1">最大尺寸限制 1080px，最適合 IG 發佈不失真</div>
                    </button>

                    <button 
                      onClick={() => setResizeMode("facebook")}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${resizeMode === "facebook" ? "bg-blue-500/20 border-blue-500/50" : "bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800"}`}
                    >
                      <div className={`text-sm font-bold ${resizeMode === "facebook" ? "text-blue-400" : "text-zinc-300"}`}>Facebook / X (推特)</div>
                      <div className="text-xs text-zinc-500 mt-1">最大尺寸限制 1200px，適合社群媒體預覽與分享</div>
                    </button>

                    <button 
                      onClick={() => setResizeMode("line")}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${resizeMode === "line" ? "bg-blue-500/20 border-blue-500/50" : "bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800"}`}
                    >
                      <div className={`text-sm font-bold ${resizeMode === "line" ? "text-blue-400" : "text-zinc-300"}`}>LINE / 通訊軟體 (快傳)</div>
                      <div className="text-xs text-zinc-500 mt-1">極限壓縮至 800px 以下，適合手機快速傳送與網頁縮圖</div>
                    </button>

                  </div>
                </div>

                <button 
                  onClick={handleCompress}
                  disabled={isCompressing || images.filter(i => i.status === 'pending').length === 0}
                  className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isCompressing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      壓縮中 ({images.filter(i => i.status === 'compressing').length}) ...
                    </>
                  ) : images.filter(i => i.status === 'pending').length === 0 ? (
                    <>全部壓縮完成 🎉</>
                  ) : (
                    <>開始批次壓縮 ({images.filter(i => i.status === 'pending').length} 張)</>
                  )}
                </button>

                {images.filter(i => i.status === 'done').length > 0 && (
                  <button 
                    onClick={handleDownloadZip}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    下載全部為 ZIP ({images.filter(i => i.status === 'done').length} 張)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 右側：圖片列表預覽區 */}
          <div className="tool-panel lg:col-span-8 flex flex-col gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
              <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-800/40 flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-300">圖片列表 ({images.length})</span>
              </div>
              <div className="p-4 bg-zinc-950/50 flex-1 overflow-y-auto max-h-[600px] space-y-3">
                {images.map((img) => (
                  <div key={img.id} className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-4 hover:border-zinc-700 transition-colors group">
                    <div className="w-16 h-16 shrink-0 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative">
                      <img src={img.originalUrl} className="w-full h-full object-cover" alt="Preview" />
                      {img.status === 'compressing' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-zinc-200 font-medium truncate mb-1 pr-4">{img.originalFile.name}</div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded font-mono">{formatBytes(img.originalFile.size)}</span>
                        
                        {img.status === 'done' && img.compressedFile && (
                          <>
                            <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded font-mono">
                              {formatBytes(img.compressedFile.size)}
                            </span>
                            <span className="text-emerald-500 font-bold ml-1">
                              (-{Math.round((1 - img.compressedFile.size / img.originalFile.size) * 100)}%)
                            </span>
                          </>
                        )}
                        {img.status === 'error' && (
                          <span className="text-red-400">{img.errorMsg}</span>
                        )}
                        {img.status === 'pending' && (
                          <span className="text-zinc-500 italic">等待處理</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {img.status === 'done' && img.compressedUrl && (
                        <a 
                          href={img.compressedUrl}
                          download={`compressed_${img.originalFile.name}`}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20"
                          title="下載單張圖片"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </a>
                      )}
                      <button 
                        onClick={() => handleRemoveItem(img.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="移除圖片"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
