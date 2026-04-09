import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ai.isaure-lohest.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
