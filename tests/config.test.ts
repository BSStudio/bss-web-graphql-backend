import { describe, expect, it, vi } from 'vitest'
import { Config } from '../src/config.js'
import dotenv from 'dotenv'

vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}))
const mockDotenv = vi.mocked(dotenv)

describe('config', () => {
  it('return config with defaults', async () => {
    expect.assertions(2)

    mockDotenv.config.mockImplementation(() => {
      console.log('with env')
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
        graphiql: false,
        watchPg: false,
        showErrorStack: false,
      },
    }
    expect(mockDotenv.config).toHaveBeenCalledOnce()
    expect(actual).toStrictEqual(expected)
  })
})
