/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SVIX_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
