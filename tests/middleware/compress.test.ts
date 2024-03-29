import {describe, expect, it, vi } from "vitest";
import compress from 'koa-compress'

vi.mock('koa-compress')

const mockCompress = vi.mocked(compress)

describe('compress', () => {
  it('should export compress', async () => {
    await import('../../src/middleware/compress');

    expect(mockCompress).toHaveBeenCalledWith({ threshold: 0 })
  })
})
