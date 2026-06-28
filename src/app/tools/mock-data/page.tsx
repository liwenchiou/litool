"use client";

import { useState } from "react";
import Link from "next/link";
import { Database, Download, Copy, Check, RefreshCw, Plus, X } from "lucide-react";

type FieldType = "uuid" | "name" | "email" | "phone" | "role" | "status" | "date" | "word" | "number" | "boolean";

interface FieldDef {
  id: string;
  name: string;
  type: FieldType;
  active: boolean;
}

const DEFAULT_FIELDS: FieldDef[] = [
  { id: "1", name: "id", type: "number", active: true },
  { id: "2", name: "uuid", type: "uuid", active: false },
  { id: "3", name: "name", type: "name", active: true },
  { id: "4", name: "email", type: "email", active: true },
  { id: "5", name: "phone", type: "phone", active: false },
  { id: "6", name: "role", type: "role", active: true },
  { id: "7", name: "status", type: "status", active: true },
  { id: "8", name: "createdAt", type: "date", active: true },
];

export default function MockDataPage() {
  const [rows, setRows] = useState(10);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Field selection state
  const [fields, setFields] = useState<FieldDef[]>(DEFAULT_FIELDS);
  
  // Add field state
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("word");

  const generateData = () => {
    const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "David", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
    const roles = ["admin", "editor", "user", "guest"];
    const statuses = ["active", "inactive", "pending", "banned"];
    const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do"];
    
    const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    const randomDate = (start: Date, end: Date) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
    };

    const data = [];
    for (let i = 1; i <= rows; i++) {
      const fn = randomItem(firstNames);
      const ln = randomItem(lastNames);
      
      const row: any = {};
      fields.filter(f => f.active).forEach(field => {
        switch (field.type) {
          case "uuid": row[field.name] = generateUUID(); break;
          case "name": row[field.name] = `${fn} ${ln}`; break;
          case "email": row[field.name] = `${fn.toLowerCase()}.${ln.toLowerCase()}@${randomItem(domains)}`; break;
          case "phone": row[field.name] = `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`; break;
          case "role": row[field.name] = randomItem(roles); break;
          case "status": row[field.name] = randomItem(statuses); break;
          case "date": row[field.name] = randomDate(new Date(2023, 0, 1), new Date()); break;
          case "word": row[field.name] = randomItem(words); break;
          case "number": row[field.name] = (field.name === 'id') ? i : Math.floor(Math.random() * 1000); break;
          case "boolean": row[field.name] = Math.random() > 0.5; break;
        }
      });
      
      data.push(row);
    }

    setOutput(JSON.stringify(data, null, 2));
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "mock_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleField = (id: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const addField = () => {
    if (!newFieldName.trim()) return;
    setFields([
      ...fields, 
      { id: Date.now().toString(), name: newFieldName.trim(), type: newFieldType, active: true }
    ]);
    setNewFieldName("");
  };

  return (
    <div className="min-h-full p-6 sm:p-12 md:p-20 max-w-6xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="page-header mb-10 flex flex-col items-start gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Database className="w-8 h-8 text-orange-400" />
          Mock Data Generator
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          開發測試必備！自訂或新增你需要的欄位，一鍵產生幾十筆擬真的測試資料 (JSON 格式)，純本地端運算。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        
        {/* Left: Config Sidebar */}
        <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-xl flex flex-col p-6 h-fit max-h-[800px] overflow-auto">
          <h2 className="text-sm font-medium text-zinc-200 mb-6 uppercase tracking-wider">參數設定</h2>
          
          <div className="flex flex-col gap-6">
            {/* Rows Count */}
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-2 block">產生筆數 (上限: 1000)</label>
              <input 
                type="number" 
                min="1" max="1000"
                value={rows}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val)) setRows("" as any);
                  else if (val > 1000) setRows(1000);
                  else setRows(val);
                }}
                onBlur={() => {
                  if (!rows || rows < 1) setRows(10);
                }}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 font-mono"
                placeholder="例如: 10"
              />
            </div>

            {/* Fields Selection */}
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-3 block">包含欄位</label>
              <div className="flex flex-col gap-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between group">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        field.active 
                          ? "bg-orange-500 border-orange-500" 
                          : "bg-zinc-800 border-zinc-600 group-hover:border-orange-500/50"
                      }`}>
                        {field.active && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">
                        {field.name} <span className="text-zinc-600 text-xs ml-1 font-mono">({field.type})</span>
                      </span>
                    </label>
                    <button 
                      onClick={() => removeField(field.id)}
                      className="text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="刪除此欄位"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Custom Field */}
            <div className="pt-4 border-t border-zinc-800/80">
              <label className="text-sm font-medium text-zinc-400 mb-3 block">新增自訂欄位</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="欄位名稱 (例如: company)"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500"
                />
                <div className="flex gap-2">
                  <select 
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                    className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg px-2 py-2 text-sm text-zinc-300 focus:outline-none focus:border-orange-500"
                  >
                    <option value="word">Word (Random String)</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="name">Name (Full Name)</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="role">Role (admin/user)</option>
                    <option value="status">Status (active/inactive)</option>
                    <option value="uuid">UUID</option>
                    <option value="date">Date</option>
                  </select>
                  <button 
                    onClick={addField}
                    disabled={!newFieldName.trim()}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg transition-colors border border-zinc-700 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={generateData}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              產生假資料
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="tool-panel bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-800/40 gap-4">
            
            <div className="text-sm font-medium text-orange-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span> JSON 輸出結果
            </div>

            <div className="flex gap-2">
              <button 
                onClick={copy}
                disabled={!output}
                className="text-xs flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-zinc-700 border border-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> 已複製</> : <><Copy className="w-3.5 h-3.5" /> 複製</>}
              </button>
              <button 
                onClick={download}
                disabled={!output}
                className="text-xs flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors bg-orange-500/10 px-3 py-1.5 rounded-lg hover:bg-orange-500/20 border border-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" /> 下載檔案
              </button>
            </div>
          </div>

          <div className="flex-1 bg-zinc-950/50 p-6 overflow-auto">
            {output ? (
              <pre className="font-mono text-sm text-zinc-300">
                {output}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 opacity-50">
                <Database className="w-16 h-16" />
                <p>點擊「產生假資料」來查看預覽結果</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
