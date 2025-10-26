import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    clearMocks: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/**/*.{js,ts}'],
      thresholds: {
        statements: 100,
      },
    },
    unstubEnvs: true,
    unstubGlobals: true,
    restoreMocks: true,
  },
})
