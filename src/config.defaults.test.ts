import dotenv from 'dotenv'
import { describe, expect, it, vi } from 'vitest'
import type { Config } from './config.js'

vi.mock('dotenv', () => ({
  default: {
    configDotenv: vi.fn(),
  },
}))
const mockDotenv = vi.mocked(dotenv)

/**
 * there are three version of the same test defined
 * import() will trigger side effects once per test file
 */
describe('config', () => {
  it('return config with defaults', async () => {
    expect.assertions(2)

    mockDotenv.configDotenv.mockImplementation(() => {
      vi.stubEnv('DATABASE_CONNECTION_STRING', 'connectionString')
      return {}
    })

    const { default: actual } = await import('../src/config.js')

    const expected: Config = {
      port: 3000,
      database: {
        connectionString: 'connectionString',
      },
      schema: 'public',
      postGraphile: {
        allowExplain: false,
        graphiql: false,
        watchPg: false,
        showErrorStack: false,
      },
    }
    expect(mockDotenv.configDotenv).toHaveBeenCalledOnce()
    expect(actual).toStrictEqual(expected)
  })
})
