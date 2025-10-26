import compress from 'koa-compress'
import { describe, expect, it, vi } from 'vitest'

vi.mock('koa-compress')

describe('compress', () => {
  it('should export compress', async () => {
    expect.assertions(3)

    const { default: actual } = await import('./compress.js')

    expect.soft(compress).toHaveBeenCalledOnce()
    expect.soft(compress).toHaveBeenCalledWith({ threshold: 0 })
    expect.soft(actual).toBe(compress({ threshold: 0 }))
  })
})
