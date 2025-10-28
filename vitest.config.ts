import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    maxWorkers: 1,
    globals: true,
    environment: 'node',
    pool: 'forks',
    isolate: true
  }
})