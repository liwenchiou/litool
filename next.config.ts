import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // 如果未來要把專案放在非根目錄（如 /litool），則需要加上 basePath: '/litool', 
  // 目前依據 MainServer 設計是掛載在根目錄 /
};

export default nextConfig;
