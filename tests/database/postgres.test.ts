import { describe, it, vi, expect } from 'vitest'
import { Pool } from 'pg'
import config from '../../src/config.js'

vi.mock('pg', () => {
  return {
    Pool: vi.fn(),
  }
})
vi.mock('../../src/config', () => ({
  default: {
    database: { connectionString: 'connectionString' },
  },
}))

const mockPool = vi.mocked(Pool)
const mockConfig = vi.mocked(config)

describe('postgres', () => {
  it('should be tested', async () => {
    expect.assertions(2)

    const { default: actual } = await import('../../src/database/postgres.js')

    expect.soft(actual).toStrictEqual(new mockPool(mockConfig.database))
    expect.soft(mockPool).toHaveBeenCalledWith(mockConfig.database)
  })
})
