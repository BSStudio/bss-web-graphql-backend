import {describe, it, vi, expect} from 'vitest'
import {Pool} from 'pg'
import config from '../../src/config'

vi.mock('pg', () => {
  return {
    Pool: vi.fn()
  }
})
vi.mock('../../src/config', () => ({
  default: {
    database: {connectionString: 'connectionString'}
  }
}))


const mockPool = vi.mocked(Pool)
const mockConfig = vi.mocked(config)

describe('postgres', () => {
  it('should be tested', async () => {
    expect.assertions(1)

    const { default: actual } = await import('../../src/database/postgres')

    expect.soft(actual).toMatchObject(new Pool(mockConfig.database))
  })
})