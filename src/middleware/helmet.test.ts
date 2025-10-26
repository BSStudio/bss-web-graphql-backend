import helmet from 'koa-helmet'
import { describe, expect, it, vi } from 'vitest'

vi.mock('koa-helmet')

describe('helmet', () => {
  it('should export helmet', async () => {
    expect.assertions(2)

    const { default: actual } = await import('./helmet.js')

    expect(helmet.default).toHaveBeenCalledOnce()
    expect(actual).toStrictEqual(helmet.default())
  })
})
