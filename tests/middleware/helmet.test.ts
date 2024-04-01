import { describe, expect, it, vi } from 'vitest'
import helmet from 'koa-helmet'

vi.mock('koa-helmet')

const mockHelmet = vi.mocked(helmet)

describe('helmet', () => {
  it('should export helmet', async () => {
    expect.assertions(2)

    const { default: actual } = await import('../../src/middleware/helmet.js')

    expect(mockHelmet).toHaveBeenCalledOnce()
    expect(actual).toStrictEqual(mockHelmet())
  })
})
