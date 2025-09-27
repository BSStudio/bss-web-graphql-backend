import helmet from 'koa-helmet'
import { describe, expect, it, vi } from 'vitest'

vi.mock('koa-helmet')

const mockHelmet = vi.mocked(helmet.default)

describe('helmet', () => {
  it('should export helmet', async () => {
    expect.assertions(2)

    const { default: actual } = await import('../../src/middleware/helmet.js')

    expect(mockHelmet).toHaveBeenCalledOnce()
    expect(actual).toStrictEqual(mockHelmet())
  })
})
