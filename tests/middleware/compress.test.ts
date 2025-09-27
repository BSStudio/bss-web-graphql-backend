import compress from 'koa-compress'
import { describe, expect, it, vi } from 'vitest'

vi.mock('koa-compress')

const mockCompress = vi.mocked(compress)

describe('compress', () => {
  it('should export compress', async () => {
    expect.assertions(3)

    const { default: actual } = await import('../../src/middleware/compress.js')

    expect.soft(mockCompress).toHaveBeenCalledOnce()
    expect.soft(mockCompress).toHaveBeenCalledWith({ threshold: 0 })
    expect.soft(actual).toBe(mockCompress({ threshold: 0 }))
  })
})
