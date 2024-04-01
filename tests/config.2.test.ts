import { describe, expect, it, vi } from 'vitest'
import dotenv from 'dotenv'

vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}))
const mockDotenv = vi.mocked(dotenv)

describe('config', () => {
  it('should throw error when DATABASE_CONNECTION_STRING is not set', async () => {
    expect.assertions(2)
    mockDotenv.config.mockImplementation(() => {
      console.log('empty')
      vi.unstubAllEnvs()
      return {}
    })

    await expect(() => import('../src/config.js')).rejects.toThrow(
      'DATABASE_CONNECTION_STRING is not set',
    )
    expect(mockDotenv.config).toHaveBeenCalledOnce()
  })
})
