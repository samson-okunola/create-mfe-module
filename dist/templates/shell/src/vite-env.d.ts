/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REGISTRY_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
