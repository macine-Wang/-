/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  // 添加其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
