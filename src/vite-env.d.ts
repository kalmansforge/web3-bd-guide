/// <reference types="vite/client" />

// Add declarations for Vite's import.meta features
interface ImportMeta {
  glob: (path: string, options?: { eager: boolean }) => Record<string, any>;
}
