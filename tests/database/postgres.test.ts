import pg from 'pg'
import { describe, expect, it, vi } from 'vitest'
import config from '../../src/config.js'

vi.mock('pg', () => {
  return {
    default: {
      Pool: vi.fn(),
    },
  }
})
vi.mock('../../src/config', () => ({
  default: {
    database: { connectionString: 'connectionString' },
  },
}))

const mockPg = vi.mocked(pg)
const mockConfig = vi.mocked(config)

describe('postgres', () => {
  it('should be tested', async () => {
    expect.assertions(2)

    const { default: actual } = await import('../../src/database/postgres.js')

    expect.soft(actual).toStrictEqual(new pg.Pool(mockConfig.database))
    expect.soft(mockPg.Pool).toHaveBeenCalledWith(mockConfig.database)
  })
})
