import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['testsInt/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    testTimeout: -1,
    globalSetup: 'testsInt/global-setup.ts',
  },
})
