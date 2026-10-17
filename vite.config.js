import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` makes the build work from any sub-path (e.g. GitHub Pages
// at /<repo>/) as well as from the root of Cloudflare Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
  // Built into /docs so GitHub Pages can serve it straight from the branch
  // ("Deploy from a branch" → folder "/docs"). Rebuild after every change.
  build: { outDir: 'docs', emptyOutDir: true },
});
