import dotenv from 'dotenv'
import { describe, expect, it, vi } from 'vitest'
import type { Config } from '../src/config.js'

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
  it('return config from env', async () => {
    expect.assertions(2)
    mockDotenv.configDotenv.mockImplementation(() => {
      vi.stubEnv('PORT', '4000')
      vi.stubEnv('DATABASE_CONNECTION_STRING', 'connectionString')
      vi.stubEnv('DATABASE_SCHEMA', 'schema')
      vi.stubEnv('POSTGRAPHILE_ALLOW_EXPLAIN', 'true')
      vi.stubEnv('POSTGRAPHILE_GRAPHIQL', 'true')
      vi.stubEnv('POSTGRAPHILE_WATCH_PG', 'true')
      vi.stubEnv('POSTGRAPHILE_SHOW_ERROR_STACK', 'true')
      return {}
    })

    const { default: actual } = await import('../src/config.js')

    const expected: Config = {
      port: 4000,
      database: {
        connectionString: 'connectionString',
      },
      schema: 'schema',
      postGraphile: {
        allowExplain: true,
        graphiql: true,
        watchPg: true,
        showErrorStack: true,
      },
    }
    expect(mockDotenv.configDotenv).toHaveBeenCalledOnce()
    expect(actual).toStrictEqual(expected)
  })
})
