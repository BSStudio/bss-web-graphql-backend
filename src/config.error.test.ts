import dotenv from 'dotenv'
import { describe, expect, it, vi } from 'vitest'

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
  it('should throw error when DATABASE_CONNECTION_STRING is not set', async () => {
    expect.assertions(2)
    mockDotenv.configDotenv.mockImplementation(() => {
      return {}
    })

    await expect(() => import('../src/config.js')).rejects.toThrow(
      'DATABASE_CONNECTION_STRING is not set',
    )
    expect(mockDotenv.configDotenv).toHaveBeenCalledOnce()
  })
})
