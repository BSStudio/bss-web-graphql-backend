import {describe, expect, it, vi } from "vitest";
import helmet from 'koa-helmet'

vi.mock('koa-helmet')

const mockHelmet = vi.mocked(helmet)

describe('helmet', () => {
  it('should export helmet', async () => {
    await import('../../src/middleware/helmet');

    expect(mockHelmet).toHaveBeenCalledWith()
  })
})
