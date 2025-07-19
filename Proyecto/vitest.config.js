import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/setupTests.js'],
    globals: true
  },
  define: {
    // Mock para window.electronAPI en tests
    'window.electronAPI': undefined
  }
})