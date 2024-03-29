import { describe, expect, it, vi } from 'vitest'
import { Config } from '../src/config.js'
import config from '../src/config.js'

vi.mock('dotenv', (importOriginal) => ({
  default: {
    config: vi.fn(),
  }
}))

describe('config', () => {
  it('should be tested', async () => {

    import.meta.env.DATABASE_CONNECTION_STRING = 'connectionString'

    const {default: actual} = await import('../src/config.js')

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
    expect(actual).toEqual(expected)
  })
})
