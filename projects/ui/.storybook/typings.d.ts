declare module '*.md' {
  const content: string;
  export default content;
}

// Imports de CSS no preview.ts são processados pelo Vite
declare module '*.css';
