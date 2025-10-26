import { describe, expect, it, vi } from 'vitest'
import healthRouter from './health.js'

vi.mock('./health.js', () => ({
  default: vi.fn(),
}))

const mockHealthRouter = vi.mocked(healthRouter)

describe('index', () => {
  it('should export routers', async () => {
    expect.assertions(2)

    const actual = await import('./index.js')

    const expected = { healthRouter: mockHealthRouter }
    expect.soft(actual).toMatchObject(expected)
    expect.soft(Object.keys(actual)).toEqual(Object.keys(expected))
  })
})
