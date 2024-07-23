import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'test/setup.js', // <-- Add the setup file here
    include: ["**/*.{test,spec}.{js,ts}"], // Ensure include matches your test files
  },
})