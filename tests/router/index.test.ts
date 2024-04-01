import { describe, expect, it, vi } from 'vitest'
import healthRouter from '../../src/router/health.js'

vi.mock('../../src/router/health.js', () => ({
  default: vi.fn(),
}))

const mockHealthRouter = vi.mocked(healthRouter)

describe('index', () => {
  it('should export routers', async () => {
    expect.assertions(2)

    const actual = await import('../../src/router/index.js')

    const expected = { healthRouter: mockHealthRouter }
    expect.soft(actual).toMatchObject(expected)
    expect.soft(Object.keys(actual)).toEqual(Object.keys(expected))
  })
})
